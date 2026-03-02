import mongoose from "mongoose";    
import {ENV} from "./env.js";
// Function to connect to MongoDB
export const connectDB=async()=>{
    try {
        if(!ENV.DB_URL){
            throw new Error("DB_URL is not defined in environment variables") 
        }
        const conn= await mongoose.connect(ENV.DB_URL)
        console.log("✅Connected to MongoDB: ",conn.connection.host)
    } catch (error) {
        console.log("Error connecting to MongoDB",error)
        process.exit(1) // Exit the process with failure
        //0 means success and 1 means failure
    }
}