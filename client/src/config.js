// URL base del backend. Configurable por variable de entorno (Vite) para que
// en producción apunte al servidor real sin tocar el código.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";
