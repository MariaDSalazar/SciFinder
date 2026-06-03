import { ApiError } from "../lib/ApiError.js";
import { translateText } from "../services/translate.service.js";

const SUPPORTED_LANGS = ["es", "en"];
const MAX_TEXT_LENGTH = 5000;

// POST /api/translate — cuerpo: { text, to: "es" | "en" }
// Valida la entrada y devuelve { translation }.
export async function handleTranslate(req, res, next) {
  try {
    const { text, to } = req.body ?? {};

    if (typeof text !== "string" || text.trim().length === 0) {
      throw new ApiError(400, "El campo 'text' es obligatorio");
    }
    if (text.length > MAX_TEXT_LENGTH) {
      throw new ApiError(400, `El texto supera el máximo de ${MAX_TEXT_LENGTH} caracteres`);
    }
    if (!SUPPORTED_LANGS.includes(to)) {
      throw new ApiError(400, "El campo 'to' debe ser 'es' o 'en'");
    }

    const translation = await translateText(text.trim(), to);
    res.json({ translation });
  } catch (error) {
    next(error);
  }
}
