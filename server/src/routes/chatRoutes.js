import express from "express"
import { getStreamToken } from "../controllers/chatControllers.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router=express.Router()

router.get("/token",protectRoute,getStreamToken) //api/chat/token


export default router