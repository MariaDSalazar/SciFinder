import { config } from "../config/env.js";
import { fetchJson } from "../lib/httpClient.js";
import { toPaperFromEric } from "../mappers/ericpaper.mapper.js";

// Campos que pedimos a ERIC (reduce el tamaño de la respuesta).
const FIELDS = "id,title,author,description,publicationdateyear,source,e_fulltextauth";

// Busca papers en ERIC (educación, del Dept. de Educación de EE.UU., sin key).
// Nota honesta: ERIC solo ordena por relevancia (no publica conteo de citas),
// así que el parámetro de orden no aplica para este motor.
export async function searchPapersEric({ query, page, perPage, fromYear, toYear }) {
  const params = new URLSearchParams({
    search: buildQuery({ query, fromYear, toYear }),
    rows: String(perPage),
    start: String((page - 1) * perPage),
    format: "json",
    fields: FIELDS,
  });

  const data = await fetchJson(`${config.eric.baseUrl}/?${params}`);

  return {
    results: (data.response?.docs ?? []).map(toPaperFromEric),
    total: data.response?.numFound ?? 0,
  };
}

// El filtro de años va dentro de la consulta, en sintaxis de rango de ERIC.
function buildQuery({ query, fromYear, toYear }) {
  if (!fromYear && !toYear) return query;
  return `(${query}) AND publicationdateyear:[${fromYear ?? 1900} TO ${toYear ?? 2100}]`;
}
