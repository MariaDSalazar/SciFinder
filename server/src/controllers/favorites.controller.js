import { ApiError } from "../lib/ApiError.js";
import { isPaperId } from "../lib/validation.js";
import { requireSessionId } from "../lib/session.js";
import { listFavorites, saveFavorite, deleteFavorite } from "../services/favorites.service.js";

// GET /api/favorites — lista de papers guardados POR ESTA SESIÓN.
export async function handleListFavorites(req, res, next) {
  try {
    const sessionId = requireSessionId(req);
    res.json(await listFavorites(sessionId));
  } catch (error) {
    next(error);
  }
}

// POST /api/favorites — guarda el paper que llega en el cuerpo, para esta sesión.
export async function handleSaveFavorite(req, res, next) {
  try {
    const sessionId = requireSessionId(req);
    const paper = req.body ?? {};
    if (!isPaperId(paper.id)) {
      throw new ApiError(400, "El campo 'id' del paper no es válido");
    }
    if (typeof paper.title !== "string" || paper.title.trim().length === 0) {
      throw new ApiError(400, "El campo 'title' es obligatorio");
    }

    // El tema es opcional: se limpia y se acota para guardarlo sano.
    const topic =
      typeof paper.topic === "string" && paper.topic.trim().length > 0
        ? paper.topic.trim().slice(0, 120)
        : null;

    const saved = await saveFavorite({ ...paper, topic }, sessionId);
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/favorites/:id — quita un paper de los favoritos de esta sesión.
export async function handleDeleteFavorite(req, res, next) {
  try {
    const sessionId = requireSessionId(req);
    const { id } = req.params;
    if (!isPaperId(id)) {
      throw new ApiError(400, "El id del favorito no es válido");
    }

    await deleteFavorite(id, sessionId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
