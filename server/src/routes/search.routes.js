import { Router } from "express";
import { handleSearch } from "../controllers/search.controller.js";

const router = Router();

// GET /api/search?q=...&page=1&perPage=25&sort=relevance|citations
router.get("/search", handleSearch);

export default router;
