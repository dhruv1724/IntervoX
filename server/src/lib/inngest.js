import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "IntervoX" });

const syncUser= inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event})=>{
        await connectDB();

        const {id,email_addresses,first_name,last_name,image_url} = event.data

        const newUser = {
            clerkId: id,
            email:email_addresses[0].email_address,
            name: `${first_name || ""} ${last_name || ""}`,
            profileImage: image_url
        }

        await User.create(newUser) //create a new user in database

        //to do :smth else
    }
)

const deleteUserFromDB= inngest.createFunction(
    {id:"delete-user-from-db"},
    {event:"clerk/user.deleted"},
    async ({event})=>{
        await connectDB();

        const {id} = event.data

        await User.deleteOne({clerkId:id}) ;//delete the user from database whose clerkId matches the id from event data

        //todo :smth else
    }
)

export const functions = [syncUser,deleteUserFromDB]
