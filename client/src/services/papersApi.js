import { API_BASE_URL } from "../config.js";

// Única función que conoce cómo hablar con nuestro backend de búsqueda.
// Construye la query string, hace el fetch y devuelve el JSON ya listo.
// Si algo falla, lanza un Error con mensaje legible (el hook lo captura).
export async function searchPapers({ query, fromYear, toYear, sort, page, perPage }) {
  const params = new URLSearchParams({ q: query });
  if (sort) params.set("sort", sort);
  if (page) params.set("page", String(page));
  if (perPage) params.set("perPage", String(perPage));
  if (fromYear) params.set("fromYear", String(fromYear));
  if (toYear) params.set("toYear", String(toYear));

  const response = await fetch(`${API_BASE_URL}/api/search?${params}`);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "No se pudo completar la búsqueda");
  }
  return data;
}
