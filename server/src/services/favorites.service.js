import { prisma } from "../lib/prisma.js";
import { ApiError } from "../lib/ApiError.js";
import { toFavoriteRecord, toPaperFromRecord } from "../mappers/favorite.mapper.js";

// Lista los favoritos DE UNA SESIÓN, los más recientes primero.
export async function listFavorites(sessionId) {
  const records = await prisma.favoritePaper.findMany({
    where: { sessionId },
    orderBy: { savedAt: "desc" },
  });
  return records.map(toPaperFromRecord);
}

// Guarda un paper como favorito de la sesión. "upsert" lo hace idempotente:
// si esa sesión ya lo tenía, lo actualiza en lugar de fallar por duplicado.
export async function saveFavorite(paper, sessionId) {
  const record = toFavoriteRecord(paper, sessionId);
  const saved = await prisma.favoritePaper.upsert({
    where: { sessionId_paperId: { sessionId, paperId: record.paperId } },
    create: record,
    update: record,
  });
  return toPaperFromRecord(saved);
}

// Elimina un favorito de la sesión. P2025 es el código de Prisma para "no existe".
export async function deleteFavorite(paperId, sessionId) {
  try {
    await prisma.favoritePaper.delete({
      where: { sessionId_paperId: { sessionId, paperId } },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(404, "El favorito no existe");
    }
    throw error;
  }
}
