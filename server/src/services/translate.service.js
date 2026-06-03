import { config } from "../config/env.js";
import { ApiError } from "../lib/ApiError.js";
import { fetchJson } from "../lib/httpClient.js";

// Traduce un texto usando el endpoint público de Google Translate (sin API key).
// Detecta el idioma de origen automáticamente (sl=auto).
// La respuesta llega como segmentos: [[["trad","orig",...], ...], ...] → se unen.
export async function translateText(text, targetLang) {
  const params = new URLSearchParams({
    client: "gtx",
    sl: "auto",
    tl: targetLang,
    dt: "t",
    q: text,
  });

  const data = await fetchJson(`${config.translate.baseUrl}/translate_a/single?${params}`);

  const segments = data?.[0];
  if (!Array.isArray(segments)) {
    throw new ApiError(502, "La traducción no está disponible en este momento");
  }

  return segments.map((segment) => segment?.[0] ?? "").join("");
}
