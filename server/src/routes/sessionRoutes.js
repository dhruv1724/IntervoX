import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createSession,getActiveSessions,getMyRecentSessions,getSessionById,joinSession,endSession } from "../controllers/sessionControllers.js";

const router= express.Router()

router.post("/",protectRoute,createSession);
router.get("/active",getActiveSessions);
router.get("/my-recent",protectRoute,getMyRecentSessions);

router.get("/:id",protectRoute,getSessionById); //: means this value is dynamic
//api/sessions/12345 this is session id for user to get
router.post("/:id/join",protectRoute,joinSession);
router.post("/:id/end",protectRoute,endSession);

export default router