import { Router } from "express";
import { handleListHistory } from "../controllers/history.controller.js";

const router = Router();

// GET /api/history?limit=8 — búsquedas recientes
router.get("/history", handleListHistory);

export default router;
