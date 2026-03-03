import { clerkMiddleware, clerkClient, requireAuth, getAuth } from '@clerk/express';
import User from '../models/User.js';
import { sign } from 'crypto';
// Middleware to protect routes and ensure the user is authenticated

export const protectRoute= [
    requireAuth(), // This middleware checks if the user is authenticated using Clerk. If not, it will return a 401 Unauthorized response.
    async(req,res,next)=>{ // This is the actual middleware function that will run after the user is authenticated.
        // Inside this function, we will check if the authenticated user exists in our database and 
        // attach the user information to the request object for use in subsequent middleware or route handlers.   
        try {
            const clerkId= req.auth.userId;
            if(!clerkId){
                return res.status(401).json({msg:"Unauthorized-invalid token"})
            }
            //check if user exists in our database
            const user= await User.findOne({clerkId});
            if(!user){
                return res.status(404).json({msg:"user not found"})
            }
            req.user=user; //attach user to request object for use in next middleware or route handler

            next(); //call next to pass control to the next middleware or route handler
        } catch (error) {
            console.error("Error in protectRoute middleware",error);
            return res.status(500).json({msg:"Internal Server error"})
        }
    }
]
