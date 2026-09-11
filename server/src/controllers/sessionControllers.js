import mongoose from "mongoose"
import Session from "../models/Session.js"
import { chatClient, streamClient } from "../lib/stream.js"

export async function createSession(req,res){
    try {
        const {problem,difficulty}=req.body
        const userId=req.user._id
        const clerkId=req.user.clerkId

        if(!problem || !difficulty){
            return res.status(400).json({message:"Problem and difficulty are required"})
        }
        //generate a unique call id for stream video
        const callId=`session_${Date.now()}_${Math.random().toString(36).substring(7)}`

        //pre-generate the session id so the DB write, video call creation, and chat channel
        //creation have no dependency on each other and can run concurrently instead of serially
        const sessionId=new mongoose.Types.ObjectId();

        const channel=chatClient.channel("messaging",callId,{
            name: `${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId]
        })

        const [session]=await Promise.all([
            Session.create({_id:sessionId,problem,difficulty,host:userId,callId}),
            streamClient.video.call("default",callId).getOrCreate({
                data:{
                    created_by_id:clerkId,
                    custom: {problem,difficulty,sessionId: sessionId.toString()}
                }
            }),
            channel.create()
        ]);

        res.status(201).json({session:session}) //key-value
    } catch (error) {
        console.log("Error in createSession controller:", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}
export async function getActiveSessions(_,res){
    try {
        const sessions=await Session.find({status:"active"}).populate("host","name profileImage clerkId").populate("participant","name profileImage clerkId").sort({createdAt: -1}).limit(20);

        res.status(200).json({sessions})
    } catch (error) {
        console.log("Error in getActiveSessions controller:", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}
export async function getMyRecentSessions(req,res){
    try {
        //user is either host or participant
        const userId=req.user._id
        const sessions=await Session.find({
            status:"completed",
            $or:[{host:userId},{participant:userId}]
        }).sort({createdAt:-1}).limit(20);

        res.status(200).json({sessions});
    } catch (error) {
        console.log("Error in getMyRecentSession controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export async function getSessionById(req,res){
    try {
        const {id}=req.params //getting the id from the id mentioned in the api end point
        const session= await Session.findById(id).populate("host","name email profileImage clerkId").populate("participant","name email profileImage clerkId")

        if(!session){
            return res.status(400).json({message:"Session not found"})
        }

        res.status(200).json({session})
    } catch (error) {
        console.log("Error in getSessionById controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export async function joinSession(req,res){
    try {
        const {id}=req.params;
        const userId=req.user._id;
        const clerkId=req.user.clerkId;

        const session= await Session.findById(id)

        if(!session){
            return res.status(400).json({message:"Session not found"})
        }
        if(session.status==="completed"){
            return res.status(400).json({message:"Cannot join a completed session"})
        }
        if(session.host.toString() === userId.toString()){
            return res.status(400).json({message:"Host cannot join their own session as participant"})
        }
        //check if session is already full or has a participant
        if(session.participant) return res.status(409).json({message:"Session is full"})

        session.participant=userId
        await session.save()

        //adding this participant to the chat box
        const channel=chatClient.channel("messaging",session.callId)
        channel.addMembers([clerkId])

        res.status(200).json({session})
    } catch (error) {
        console.log("Error in joinSession controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export async function endSession(req,res){
     try {
        const {id}=req.params
        const userId=req.user._id

        const session=await Session.findById(id)

        if(!session) return res.status(404).json({message:"Session not found"});

        //check if user is host or not
        //only host can end the session
        if(session.host.toString() !== userId.toString()){
            return res.status(403).json({message: "Only the host can end the session"})
        }

        //check if session is already completed
        if(session.status==="completed"){
            return res.status(400).json({message: "Session is already completed"})
        }


        //make it completed
        session.status="completed";

        const call=streamClient.video.call("default",session.callId)
        const channel= chatClient.channel("messaging", session.callId)

        //these three are independent of each other's results, so run them concurrently
        //instead of paying for each round trip serially
        await Promise.all([
            call.delete({hard:true}),
            channel.delete(),
            session.save()
        ]);

        res.status(200).json({session,message:"Session ended successfully"})
     } catch (error) {
        console.log("Error in endSession controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
     }
}