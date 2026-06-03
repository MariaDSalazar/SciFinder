import { prisma } from "../lib/prisma.js";

// Registra una búsqueda realizada (la llama el controlador de búsqueda
// sin esperar el resultado: el historial nunca debe frenar una búsqueda).
export function recordSearch({ query, total }) {
  return prisma.searchHistory.create({ data: { query, total } });
}

// Últimas búsquedas distintas (sin repetir el mismo término).
export function listRecentSearches(limit) {
  return prisma.searchHistory.findMany({
    distinct: ["query"],
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { query: true, total: true, createdAt: true },
  });
}
