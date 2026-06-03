import { ApiError } from "./ApiError.js";

// Cliente HTTP reutilizable sobre fetch.
// Hace GET (o POST con cuerpo JSON), espera JSON y traduce cualquier fallo de
// red a un ApiError claro. Acepta cabeceras extra (ej. API keys).
// Si la fuente responde con error, expone "externalStatus" para que el servicio
// que llama pueda traducirlo (ej. 404 externo → "paper no encontrado").
export async function fetchJson(url, { timeoutMs = 10000, headers = {}, method = "GET", body } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined && { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new ApiError(502, `La fuente externa respondió con estado ${response.status}`);
      error.externalStatus = response.status;
      throw error;
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
