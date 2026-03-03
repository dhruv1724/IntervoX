import express from "express";
import path from "path";
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { inngest, functions } from "./lib/inngest.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from "./routes/chatRoutes.js";

const app =express()

const __dirname = path.resolve();

//middlewares
app.use(express.json())


//credentials:true server allows browser to send cookies along with requests, 
// which is necessary for maintaining user sessions and authentication states when the client and server are on different domains.
app.use(cors({origin: ENV.CLIENT_URL,credentials:true})) //enable CORS for all routes
//CORS is a security feature implemented by browsers to restrict web applications 
// running on one origin from accessing resources on a different origin. 
// By enabling CORS, you allow your server to accept requests from other origins, 
// which is essential for building APIs that can be consumed by web applications hosted on different domains.

app.use(clerkMiddleware()) //use clerk middleware to handle authentication and user sessions
//this adds auth property to the request object, which contains information about the authenticated user and their session.

app.use("/api/inngest",serve({client:inngest,functions})) //serve inngest functions at the specified route
app.use("/api/chat",chatRoutes) //use chat routes for handling chat related API requests

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"api is up and running"})
});


//make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

const startServer=async()=>{
    try {
        //connect to database before starting the server
        await connectDB();
        app.listen(ENV.PORT,() => {
            console.log(`✅Server is running on port ${ENV.PORT}`)
        
        });
    } catch (error) {
        console.error("❌ Error starting server",error)
        process.exit(1)
    }
}

startServer();