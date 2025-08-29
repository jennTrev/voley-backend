// routes/rankingRoutes.js
import express from "express";
import { rankingPersonal, rankingGeneral } from "../controllers/rankingController.js";

const router = express.Router();

// 📌 Ranking personal (por cuentaId, últimos 7 días)
router.get("/personal/:cuentaId", rankingPersonal);

// 📌 Ranking general (todos los jugadores, últimos 7 días)
router.get("/general", rankingGeneral);

export default router;
