// Identificador anónimo de sesión por navegador.
// Se genera UNA vez y queda en localStorage: con él, el backend separa los
// favoritos y el historial de cada visitante (no es un login, es un alcance
// por navegador — si se borra el almacenamiento local, se pierde el vínculo).
const STORAGE_KEY = "scifinder-session-id";

export function getSessionId() {
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }
  return sessionId;
}
