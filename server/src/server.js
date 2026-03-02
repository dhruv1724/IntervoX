import express from "express";
import path from "path";
import {ENV} from "./lib/env.js";
import { connectDB } from "./lib/db.js";


const app =express()

const __dirname = path.resolve();

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"api is up and running"})
})
app.get("/books",(req,res)=>{
    res.status(200).json({msg:"this is the books endpoint"})
})

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