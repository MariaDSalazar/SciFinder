import { ApiError } from "../lib/ApiError.js";

// Manejador central de errores. Express lo reconoce porque recibe 4 parámetros
// (err, req, res, next): el "next" es obligatorio aunque no se use aquí.
// Traduce cualquier error en una respuesta JSON coherente: { error: "..." }.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Error interno del servidor";

  // Los errores inesperados (500) sí se registran para poder depurarlos.
  if (statusCode === 500) {
    console.error("❌ Error no controlado:", err);
  }

  res.status(statusCode).json({ error: message });
}
