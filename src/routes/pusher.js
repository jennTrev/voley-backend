// routes/espRoutes.js
import express from "express";
import { sendCommand } from "../controllers/pusherController.js";

const router = express.Router();

router.post("/send-command", sendCommand);

export default router;