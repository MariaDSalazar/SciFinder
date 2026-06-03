import { config } from "../config/env.js";
import { fetchJson } from "../lib/httpClient.js";

// Busca un PDF de acceso abierto para un DOI usando el endpoint "Discover"
// de CORE (hecho exactamente para esto). Requiere API key (vive en el .env).
// Es una fuente SECUNDARIA: si no hay key, falla o no encuentra nada,
// devuelve null y el detalle se muestra igual. Nunca rompe la vista.
export async function findOpenAccessPdf(doi) {
  if (!doi || !config.core.apiKey) return null;

  const bareDoi = doi.replace("https://doi.org/", "");

  try {
    const data = await fetchJson(`${config.core.baseUrl}/discover`, {
      method: "POST",
      body: { doi: bareDoi },
      headers: { Authorization: `Bearer ${config.core.apiKey}` },
    });

    return data.fullTextLink || null;
  } catch {
    return null;
  }
}
