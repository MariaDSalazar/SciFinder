import { prisma } from "../lib/prisma.js";

// Registra una búsqueda DE UNA SESIÓN (la llama el controlador de búsqueda
// sin esperar el resultado: el historial nunca debe frenar una búsqueda).
export function recordSearch({ query, total, sessionId }) {
  return prisma.searchHistory.create({ data: { query, total, sessionId } });
}

// Últimas búsquedas distintas DE UNA SESIÓN (sin repetir el mismo término).
export function listRecentSearches(sessionId, limit) {
  return prisma.searchHistory.findMany({
    where: { sessionId },
    distinct: ["query"],
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { query: true, total: true, createdAt: true },
  });
}
