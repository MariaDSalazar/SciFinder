import { config } from "../config/env.js";
import { ApiError } from "../lib/ApiError.js";
import { fetchJson } from "../lib/httpClient.js";
import { toPaperFromS2 } from "../mappers/s2paper.mapper.js";

// Campos del enriquecimiento del detalle:
//   tldr → resumen corto generado por IA
//   influentialCitationCount → citas "que de verdad importan" (no solo el conteo)
const ENRICHMENT_FIELDS = "tldr,influentialCitationCount";

// Campos de la búsqueda (equivalentes a los que pedimos a OpenAlex).
const SEARCH_FIELDS =
  "externalIds,title,abstract,year,citationCount,authors,venue,isOpenAccess,openAccessPdf";

// Cabecera de autenticación: con key hay cupo propio; sin key, cupo compartido.
function authHeaders() {
  return config.semanticScholar.apiKey ? { "x-api-key": config.semanticScholar.apiKey } : {};
}

// Enriquece un paper usando su DOI. Es una fuente SECUNDARIA:
// si Semantic Scholar no tiene el paper, falla o tarda, devolvemos null
// y el detalle se muestra igual con los datos de OpenAlex. Nunca rompe la vista.
export async function getEnrichment(doi) {
  if (!doi) return null;

  const bareDoi = doi.replace("https://doi.org/", "");
  const url = `${config.semanticScholar.baseUrl}/graph/v1/paper/DOI:${bareDoi}?fields=${ENRICHMENT_FIELDS}`;

  try {
    const data = await fetchJson(url, { headers: authHeaders() });
    return {
      tldr: data.tldr?.text ?? null,
      influentialCitations: data.influentialCitationCount ?? null,
    };
  } catch {
    return null;
  }
}

// Busca papers en Semantic Scholar como MOTOR alternativo a OpenAlex.
// Notas honestas de esta fuente:
//  - Solo ordena por relevancia (no admite ordenar por citas en el servidor),
//    por eso el orden por citas se aplica sobre la página recibida.
//  - Los resultados sin DOI se descartan: sin DOI no hay detalle ni favoritos.
export async function searchPapersS2({ query, page, perPage, sort, fromYear, toYear }) {
  const params = new URLSearchParams({
    query,
    offset: String((page - 1) * perPage),
    limit: String(perPage),
    fields: SEARCH_FIELDS,
  });

  // Filtro por años en formato de S2: "2010-2020", "2010-" o "-2020".
  if (fromYear || toYear) {
    params.set("year", `${fromYear ?? ""}-${toYear ?? ""}`);
  }

  try {
    const data = await fetchJson(
      `${config.semanticScholar.baseUrl}/graph/v1/paper/search?${params}`,
      { headers: authHeaders() },
    );

    const results = (data.data ?? []).map(toPaperFromS2).filter((paper) => paper.id !== null);
    if (sort === "citations") {
      results.sort((a, b) => b.citations - a.citations);
    }

    return { results, total: data.total ?? results.length };
  } catch (error) {
    if (error.externalStatus === 429) {
      throw new ApiError(
        503,
        "Semantic Scholar está saturado en este momento; intenta en unos segundos o cambia el motor a OpenAlex",
      );
    }
    throw error;
  }
}
