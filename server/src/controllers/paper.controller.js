import { ApiError } from "../lib/ApiError.js";
import { getPaperById } from "../services/openalex.service.js";
import { getEnrichment } from "../services/semanticscholar.service.js";

// Formato del id corto de OpenAlex: "W" seguido de dígitos.
const OPENALEX_ID_PATTERN = /^W\d+$/i;

// GET /api/papers/:id — detalle de un paper:
// OpenAlex aporta los datos base; Semantic Scholar lo enriquece (TLDR + citas
// influyentes). El enriquecimiento es opcional: si falla, los campos van en null.
export async function handleGetPaper(req, res, next) {
  try {
    const { id } = req.params;
    if (!OPENALEX_ID_PATTERN.test(id)) {
      throw new ApiError(400, "El id del paper no es válido (formato esperado: W seguido de números)");
    }

    const paper = await getPaperById(id);
    const enrichment = await getEnrichment(paper.doi);

    res.json({
      ...paper,
      tldr: enrichment?.tldr ?? null,
      influentialCitations: enrichment?.influentialCitations ?? null,
    });
  } catch (error) {
    next(error);
  }
}
