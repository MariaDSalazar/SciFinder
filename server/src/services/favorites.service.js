import { prisma } from "../lib/prisma.js";
import { ApiError } from "../lib/ApiError.js";
import { toFavoriteRecord, toPaperFromRecord } from "../mappers/favorite.mapper.js";

// Lista los favoritos, los más recientes primero.
export async function listFavorites() {
  const records = await prisma.favoritePaper.findMany({ orderBy: { savedAt: "desc" } });
  return records.map(toPaperFromRecord);
}

// Guarda un paper como favorito. "upsert" lo hace idempotente:
// si ya existe, lo actualiza en lugar de fallar por duplicado.
export async function saveFavorite(paper) {
  const record = toFavoriteRecord(paper);
  const saved = await prisma.favoritePaper.upsert({
    where: { id: record.id },
    create: record,
    update: record,
  });
  return toPaperFromRecord(saved);
}

// Elimina un favorito. P2025 es el código de Prisma para "no existe".
export async function deleteFavorite(paperId) {
  try {
    await prisma.favoritePaper.delete({ where: { id: paperId } });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(404, "El favorito no existe");
    }
    throw error;
  }
}
