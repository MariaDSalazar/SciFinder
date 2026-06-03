import { config } from "../config/env.js";
import { ApiError } from "../lib/ApiError.js";
import { fetchJson } from "../lib/httpClient.js";
import { toPaper } from "../mappers/paper.mapper.js";

// Campos que le pedimos a OpenAlex con "select". Pedir solo lo necesario reduce
// el tamaño de la respuesta y acelera la búsqueda.
const FIELDS = [
  "id",
  "doi",
  "display_name",
  "publication_year",
  "cited_by_count",
  "authorships",
  "primary_location",
  "open_access",
  "best_oa_location",
  "abstract_inverted_index",
].join(",");

// Traduce nuestras opciones de orden a la sintaxis de OpenAlex.
const SORT_OPTIONS = {
  relevance: "relevance_score:desc",
  citations: "cited_by_count:desc",
};

// Busca papers en OpenAlex y devuelve resultados ya limpios + datos de paginación.
export async function searchPapers({ query, page, perPage, sort, fromYear, toYear }) {
  const params = new URLSearchParams({
    search: query,
    page: String(page),
    per_page: String(perPage),
    select: FIELDS,
    sort: SORT_OPTIONS[sort] ?? SORT_OPTIONS.relevance,
  });

  // Filtro por rango de años (opcional). OpenAlex los combina con AND.
  const filters = [];
  if (fromYear) filters.push(`from_publication_date:${fromYear}-01-01`);
  if (toYear) filters.push(`to_publication_date:${toYear}-12-31`);
  if (filters.length > 0) params.set("filter", filters.join(","));

  const url = `${config.openAlex.baseUrl}/works?${params}`;
  const data = await fetchJson(url);

  return {
    results: (data.results ?? []).map(toPaper),
    total: data.meta?.count ?? 0,
    page,
    perPage,
  };
}

// Obtiene UN paper por su id corto de OpenAlex (ej. "W2741809807").
// Traduce el 404 externo a un 404 nuestro con mensaje claro.
export async function getPaperById(openAlexId) {
  const params = new URLSearchParams({ select: FIELDS });
  const url = `${config.openAlex.baseUrl}/works/${openAlexId}?${params}`;

  try {
    const work = await fetchJson(url);
    return toPaper(work);
  } catch (error) {
    if (error.externalStatus === 404) {
      throw new ApiError(404, "No se encontró el paper solicitado");
    }
    throw error;
  }
}
