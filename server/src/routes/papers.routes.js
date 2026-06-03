import { Router } from "express";
import { handleGetPaper } from "../controllers/paper.controller.js";

const router = Router();

// GET /api/papers/:id — detalle de un paper (id corto de OpenAlex, ej. W2741809807)
router.get("/papers/:id", handleGetPaper);

export default router;
