import { ApiError } from "../lib/ApiError.js";

// Se ejecuta cuando ninguna ruta coincide: convierte el caso en un 404 limpio
// y lo pasa al manejador central de errores.
export function notFound(req, res, next) {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}
