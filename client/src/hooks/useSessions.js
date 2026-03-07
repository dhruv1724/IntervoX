import {useQuery, useMutation} from "@tanstack/react-query"
import toast from "react-hot-toast"
import { sessionApi } from "../api/sessions.js"

// useMutation is used to create delete and update data
//use Query is used to fetch data
//idhar hum apne customized hook bna rhe hai useMutation and useQuery
// to perform the above function using session api
export const useCreateSession=()=>{
    const result= useMutation({
        mutationFn: sessionApi.createSession,
        onSuccess: ()=>toast.success("session created successfully"),
        onError: ()=>toast.error(error.response?.data?.message ||" Failed to create room"),
    });
    return result;
}

export const useActiveSessions =()=>{
    const result= useQuery({
        queryKey:["activeSessions"],
        queryFn: sessionApi.getActiveSessions,
    });
    return result;
}

export const useMyRecentSessions =()=>{
    const result= useQuery({
        queryKey:["myRecentSessions"],
        queryFn: sessionApi.getMyRecentSessions,
    });
    return result;
}

// "!!" is a method to create data into boolean
export const useSessionById =(id)=>{
    const result= useQuery({
        queryKey:[`session ${id}`],
        queryFn: ()=>sessionApi.getActiveSessionById(id),
        enabled: !!id,
        refetchInterval:5000, //refetch every 5 seconds to detect session changes
    });
    return result;
}

export const  useJoinSession=(id)=>{
    return useMutation({
        mutationKey: ["joinSession"],
        mutationFn: ()=>sessionApi.joinSession(id),
        onSuccess: ()=> toast.success("Joined session successfully"),
        onError: ()=> toast.error(error.response?.data?.message || "Failed to join session")
    })
}

export const  useEndSession=(id)=>{
    return useMutation({
        mutationKey: ["endSession"],
        mutationFn: ()=>sessionApi.endSession(id),
        onSuccess: ()=> toast.success("Session ended successfully"),
        onError: ()=> toast.error(error.response?.data?.message || "Failed to end session")
    })
}