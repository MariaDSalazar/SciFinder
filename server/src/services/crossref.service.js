import { config } from "../config/env.js";
import { fetchJson } from "../lib/httpClient.js";
import { toPaperFromCrossref } from "../mappers/crossrefpaper.mapper.js";

// Campos que pedimos a Crossref (reduce el tamaño de la respuesta).
const FIELDS = "DOI,title,author,issued,container-title,is-referenced-by-count,abstract";

// Busca papers en Crossref (el registro oficial de DOIs, sin API key).
// Los resultados sin DOI se descartan: sin DOI no hay detalle ni favoritos.
export async function searchPapersCrossref({ query, page, perPage, sort, fromYear, toYear }) {
  const params = new URLSearchParams({
    query,
    rows: String(perPage),
    offset: String((page - 1) * perPage),
    select: FIELDS,
  });

  if (sort === "citations") {
    params.set("sort", "is-referenced-by-count");
    params.set("order", "desc");
  }

  const filters = [];
  if (fromYear) filters.push(`from-pub-date:${fromYear}-01-01`);
  if (toYear) filters.push(`until-pub-date:${toYear}-12-31`);
  if (filters.length > 0) params.set("filter", filters.join(","));

  const data = await fetchJson(`${config.crossref.baseUrl}/works?${params}`);

  const results = (data.message?.items ?? [])
    .map(toPaperFromCrossref)
    .filter((paper) => paper.id !== null);

  return { results, total: data.message?.["total-results"] ?? results.length };
}
