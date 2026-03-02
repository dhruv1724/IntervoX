import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,      
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        profileImage:{
            type: String,
            default:""
        },
        clerkId:{
            type: String,
            required: true,
            unique: true
        } // This field will store the unique identifier from Clerk for each user
    },
    {timestamps: true} // This will automatically add createdAt and updatedAt fields to the schema
); 

const User = mongoose.model("User", userSchema);

export default User;