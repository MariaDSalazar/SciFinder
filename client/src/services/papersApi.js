import { API_BASE_URL } from "../config.js";

// Helper interno reutilizado por todas las llamadas al backend:
// hace el fetch, parsea el JSON y convierte errores en mensajes legibles.
async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
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
