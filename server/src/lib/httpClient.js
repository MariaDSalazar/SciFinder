import { ApiError } from "./ApiError.js";

// Cliente HTTP reutilizable sobre fetch.
// Hace un GET, espera JSON y traduce cualquier fallo de red a un ApiError claro.
// Lo usarán todos los servicios externos (OpenAlex, y luego Semantic Scholar, etc.).
export async function fetchJson(url, { timeoutMs = 10000 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(502, `La fuente externa respondió con estado ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === "AbortError") {
      throw new ApiError(504, "La fuente externa tardó demasiado en responder");
    }
    throw new ApiError(502, "No se pudo contactar la fuente externa");
  } finally {
    clearTimeout(timeout);
  }
}
