import { ApiError } from "../lib/ApiError.js";
import { isOpenAlexId } from "../lib/validation.js";
import { getPaperById } from "../services/openalex.service.js";
import { getEnrichment } from "../services/semanticscholar.service.js";
import { getOpenCitationsStats } from "../services/opencitations.service.js";

// GET /api/papers/:id — detalle de un paper:
// OpenAlex aporta los datos base; Semantic Scholar lo enriquece (TLDR + citas
// influyentes). El enriquecimiento es opcional: si falla, los campos van en null.
export async function handleGetPaper(req, res, next) {
  try {
    const { id } = req.params;
    if (!isOpenAlexId(id)) {
      throw new ApiError(400, "El id del paper no es válido (formato esperado: W seguido de números)");
    }

    const paper = await getPaperById(id);

    // Los dos enriquecimientos van en paralelo (no se suman las esperas)
    // y son opcionales: si alguno falla, sus campos van en null.
    const [enrichment, openCitations] = await Promise.all([
      getEnrichment(paper.doi),
      getOpenCitationsStats(paper.doi),
    ]);

    res.json({
      ...paper,
      tldr: enrichment?.tldr ?? null,
      influentialCitations: enrichment?.influentialCitations ?? null,
      openCitations,
      // Transparencia: qué fuente de datos respondió para este paper.
      sources: {
        openAlex: true,
        semanticScholar: enrichment !== null,
        openCitations: openCitations !== null,
      },
    });
  } catch (error) {
    next(error);
  }
}
