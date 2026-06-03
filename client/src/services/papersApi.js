import { API_BASE_URL } from "../config.js";

// Helper interno reutilizado por todas las llamadas al backend:
// hace el fetch (GET o POST con JSON), parsea la respuesta
// y convierte errores en mensajes legibles.
async function requestJson(path, { method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "No se pudo completar la operación");
  }
  return data;
}

// Busca papers en el backend con filtros y orden.
export function searchPapers({ query, fromYear, toYear, sort, page, perPage }) {
  const params = new URLSearchParams({ q: query });
  if (sort) params.set("sort", sort);
  if (page) params.set("page", String(page));
  if (perPage) params.set("perPage", String(perPage));
  if (fromYear) params.set("fromYear", String(fromYear));
  if (toYear) params.set("toYear", String(toYear));

  return requestJson(`/api/search?${params}`);
}

// Obtiene el detalle de un paper (enriquecido con TLDR y citas influyentes).
export function getPaper(paperId) {
  return requestJson(`/api/papers/${encodeURIComponent(paperId)}`);
}

// Traduce un texto al idioma indicado ("es" | "en") usando el backend.
export function translateText(text, to) {
  return requestJson("/api/translate", { method: "POST", body: { text, to } });
}

// ── Favoritos (persisten en la base de datos del backend) ──
export function getFavorites() {
  return requestJson("/api/favorites");
}

export function addFavorite(paper) {
  return requestJson("/api/favorites", { method: "POST", body: paper });
}

export function removeFavorite(paperId) {
  return requestJson(`/api/favorites/${encodeURIComponent(paperId)}`, { method: "DELETE" });
}

// ── Historial de búsquedas ──
export function getRecentSearches() {
  return requestJson("/api/history");
}
