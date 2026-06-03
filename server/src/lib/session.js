import { ApiError } from "./ApiError.js";

// El frontend genera un id de sesión anónimo (UUID en localStorage) y lo envía
// en la cabecera X-Session-Id. Con él, favoritos e historial son PRIVADOS de
// cada visitante. No es autenticación real: es un alcance por navegador.
const SESSION_ID_PATTERN = /^[\w-]{8,64}$/;

// Para endpoints que REQUIEREN sesión (favoritos, historial).
export function requireSessionId(req) {
  const sessionId = optionalSessionId(req);
  if (!sessionId) {
    throw new ApiError(400, "Falta el identificador de sesión (cabecera X-Session-Id)");
  }
  return sessionId;
}

// Para endpoints donde la sesión es opcional (ej. registrar historial al buscar).
export function optionalSessionId(req) {
  const sessionId = req.get("x-session-id");
  return sessionId && SESSION_ID_PATTERN.test(sessionId) ? sessionId : null;
}
