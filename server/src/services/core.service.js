import { config } from "../config/env.js";
import { fetchJson } from "../lib/httpClient.js";

// Busca un PDF de acceso abierto para un DOI usando el endpoint "Discover"
// de CORE (hecho exactamente para esto). Requiere API key (vive en el .env).
// Es una fuente SECUNDARIA: si no hay key, falla o no encuentra nada,
// devuelve null y el detalle se muestra igual. Nunca rompe la vista.
// IMPORTANTE: antes de ofrecer el enlace al usuario se verifica que realmente
// responda — CORE a veces apunta a copias que ya no existen, y un botón
// "Ver PDF" que lleva a un error es peor que no mostrarlo.
export async function findOpenAccessPdf(doi) {
  if (!doi || !config.core.apiKey) return null;

  const bareDoi = doi.replace("https://doi.org/", "");

  try {
    const data = await fetchJson(`${config.core.baseUrl}/discover`, {
      method: "POST",
      body: { doi: bareDoi },
      headers: { Authorization: `Bearer ${config.core.apiKey}` },
    });

    const link = data.fullTextLink || null;
    if (!link) return null;

    return (await linkResponds(link)) ? link : null;
  } catch {
    return null;
  }
}

// Comprueba que un enlace responda correctamente (sin descargar el archivo).
// Algunos servidores no aceptan HEAD (405): a esos se les da el beneficio
// de la duda, porque el recurso suele existir.
async function linkResponds(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    return response.ok || response.status === 405;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
