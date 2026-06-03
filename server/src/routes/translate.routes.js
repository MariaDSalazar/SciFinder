import { Router } from "express";
import { handleTranslate } from "../controllers/translate.controller.js";

const router = Router();

// POST /api/translate — body: { text: "...", to: "es" | "en" }
router.post("/translate", handleTranslate);

export default router;
