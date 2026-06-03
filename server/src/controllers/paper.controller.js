import { ApiError } from "../lib/ApiError.js";
import { cached, TTL } from "../lib/cache.js";
import { isPaperId } from "../lib/validation.js";
import { getPaperById } from "../services/openalex.service.js";
import { getEnrichment } from "../services/semanticscholar.service.js";
import { getOpenCitationsStats } from "../services/opencitations.service.js";
import { findOpenAccessPdf } from "../services/core.service.js";

// GET /api/papers/:id — detalle de un paper:
// OpenAlex aporta los datos base; Semantic Scholar lo enriquece (TLDR + citas
// influyentes). El enriquecimiento es opcional: si falla, los campos van en null.
export async function handleGetPaper(req, res, next) {
  try {
    const { id } = req.params;
    if (!isPaperId(id)) {
      throw new ApiError(400, "El id del paper no es válido (se espera 'W...' o 'doi:10...')");
    }

    // El mismo paper dentro de 30 min → sale de la caché (con sus
    // enriquecimientos incluidos) sin tocar las 3 APIs externas.
    const { value: payload, hit } = await cached(`paper:${id}`, TTL.detail, async () => {
      const paper = await getPaperById(id);

      // Los enriquecimientos van en paralelo (no se suman las esperas) y son
      // opcionales: si alguno falla, sus campos van en null. CORE solo se
      // consulta cuando el paper NO trae PDF (cuida el cupo diario de la key).
      const [enrichment, openCitations, corePdf] = await Promise.all([
        getEnrichment(paper.doi),
        getOpenCitationsStats(paper.doi),
        paper.pdfUrl ? Promise.resolve(null) : findOpenAccessPdf(paper.doi),
      ]);

      return {
        ...paper,
        pdfUrl: paper.pdfUrl ?? corePdf,
        pdfSource: paper.pdfUrl ? paper.pdfSource : corePdf ? "CORE" : null,
        tldr: enrichment?.tldr ?? null,
        influentialCitations: enrichment?.influentialCitations ?? null,
        openCitations,
        // Transparencia: qué fuente de datos respondió para este paper.
        sources: {
          openAlex: true,
          semanticScholar: enrichment !== null,
          openCitations: openCitations !== null,
          core: corePdf !== null,
        },
      };
    });

    res.set("X-Cache", hit ? "HIT" : "MISS");
    res.json(payload);
  } catch (error) {
    next(error);
  }
}
