import { config } from "../config/env.js";
import { fetchJson } from "../lib/httpClient.js";

// Estadísticas de citas ABIERTAS desde OpenCitations (por DOI):
//   citationCount  → cuántos papers lo citan (según citas abiertas)
//   referenceCount → a cuántos papers cita él
// Es una fuente SECUNDARIA: si falla o no conoce el DOI, devuelve null
// y el detalle se muestra igual. Nunca rompe la vista.
export async function getOpenCitationsStats(doi) {
  if (!doi) return null;

  const bareDoi = doi.replace("https://doi.org/", "");

  try {
    const [citations, references] = await Promise.all([
      fetchJson(`${config.openCitations.baseUrl}/citation-count/doi:${bareDoi}`),
      fetchJson(`${config.openCitations.baseUrl}/reference-count/doi:${bareDoi}`),
    ]);

    const citationCount = Number.parseInt(citations?.[0]?.count, 10);
    const referenceCount = Number.parseInt(references?.[0]?.count, 10);

    if (!Number.isFinite(citationCount) && !Number.isFinite(referenceCount)) {
      return null;
    }

    return {
      citationCount: Number.isFinite(citationCount) ? citationCount : null,
      referenceCount: Number.isFinite(referenceCount) ? referenceCount : null,
    };
  } catch {
    return null;
  }
}
