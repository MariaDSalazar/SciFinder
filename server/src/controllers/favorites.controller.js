import { ApiError } from "../lib/ApiError.js";
import { isOpenAlexId } from "../lib/validation.js";
import { listFavorites, saveFavorite, deleteFavorite } from "../services/favorites.service.js";

// GET /api/favorites — lista de papers guardados.
export async function handleListFavorites(req, res, next) {
  try {
    res.json(await listFavorites());
  } catch (error) {
    next(error);
  }
}

// POST /api/favorites — guarda el paper que llega en el cuerpo.
export async function handleSaveFavorite(req, res, next) {
  try {
    const paper = req.body ?? {};
    if (!isOpenAlexId(paper.id)) {
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

    const saved = await saveFavorite({ ...paper, topic });
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
}

// DELETE /api/favorites/:id — quita un paper de favoritos.
export async function handleDeleteFavorite(req, res, next) {
  try {
    const { id } = req.params;
    if (!isOpenAlexId(id)) {
      throw new ApiError(400, "El id del favorito no es válido");
    }

    await deleteFavorite(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
