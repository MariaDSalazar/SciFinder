import { config } from "../config/env.js";
import { fetchJson } from "../lib/httpClient.js";
import { toPaperFromEuropePmc } from "../mappers/epmcpaper.mapper.js";

// Busca papers en Europe PMC (biomedicina y ciencias de la vida, sin API key).
// Notas honestas de esta fuente:
//  - Su paginación funciona por cursor, no por número de página; como la UI
//    hoy solo muestra la primera página, se consulta siempre el primer cursor.
//  - Los resultados sin DOI se descartan: sin DOI no hay detalle ni favoritos.
export async function searchPapersEuropePmc({ query, perPage, sort, fromYear, toYear }) {
  const params = new URLSearchParams({
    query: buildQuery({ query, fromYear, toYear }),
    format: "json",
    pageSize: String(perPage),
    resultType: "core", // incluye abstract, autores estructurados y enlaces a PDF
    cursorMark: "*",
  });

  if (sort === "citations") {
    params.set("sort", "CITED desc");
  }

  const data = await fetchJson(`${config.europePmc.baseUrl}/search?${params}`);

  const results = (data.resultList?.result ?? [])
    .map(toPaperFromEuropePmc)
    .filter((paper) => paper.id !== null);

  return { results, total: data.hitCount ?? results.length };
}

// Sintaxis de consulta de Europe PMC: el filtro de años va dentro del query
// como rango PUB_YEAR:[desde TO hasta].
function buildQuery({ query, fromYear, toYear }) {
  if (!fromYear && !toYear) return query;
  return `(${query}) AND (PUB_YEAR:[${fromYear ?? 1000} TO ${toYear ?? 3000}])`;
}
