import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res){
    try {
        //use clerk id for stream not mongodb id because it shouuld match the id we have on stream dashboard
        const token=chatClient.createToken(req.user.clerkId) //create a stream token for the authenticated user using their user ID from the request's auth property
        res.status(200).json({
            token,
            userId:req.user.clerkId,
            userName:req.user.firstName || "",
            userImage:req.user.image
        })
    } catch (error) {
        console.log("❌ Error generating stream token",error);
        res.status(500).json({msg:"error generating stream token",error:error.message}) 
    }
} 