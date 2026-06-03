import { config } from "../config/env.js";
import { fetchJson } from "../lib/httpClient.js";

// Campos que pedimos a Semantic Scholar:
//   tldr → resumen corto generado por IA
//   influentialCitationCount → citas "que de verdad importan" (no solo el conteo)
const FIELDS = "tldr,influentialCitationCount";

// Enriquece un paper usando su DOI. Es una fuente SECUNDARIA:
// si Semantic Scholar no tiene el paper, falla o tarda, devolvemos null
// y el detalle se muestra igual con los datos de OpenAlex. Nunca rompe la vista.
export async function getEnrichment(doi) {
  if (!doi) return null;

  const bareDoi = doi.replace("https://doi.org/", "");
  const url = `${config.semanticScholar.baseUrl}/graph/v1/paper/DOI:${bareDoi}?fields=${FIELDS}`;
  const headers = config.semanticScholar.apiKey
    ? { "x-api-key": config.semanticScholar.apiKey }
    : {};

  try {
    const data = await fetchJson(url, { headers });
    return {
      tldr: data.tldr?.text ?? null,
      influentialCitations: data.influentialCitationCount ?? null,
    };
  } catch {
    return null;
  }
}
