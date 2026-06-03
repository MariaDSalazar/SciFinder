import { Router } from "express";
import {
  handleListFavorites,
  handleSaveFavorite,
  handleDeleteFavorite,
} from "../controllers/favorites.controller.js";

const router = Router();

// GET    /api/favorites      — listar favoritos
// POST   /api/favorites      — guardar un paper (cuerpo JSON)
// DELETE /api/favorites/:id  — quitar un favorito
router.get("/favorites", handleListFavorites);
router.post("/favorites", handleSaveFavorite);
router.delete("/favorites/:id", handleDeleteFavorite);

export default router;
