// routes/espRoutes.js
import express from "express";
import { sendCommand, pusherAuth} from "../controllers/pusherController.js";

const router = express.Router();

router.post("/send-command", sendCommand);
router.post('/pusher/auth', pusherAuth);
export default router;