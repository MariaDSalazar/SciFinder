import { config } from "../config/env.js";
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
export async function searchPapers({ query, page, perPage, sort }) {
  const params = new URLSearchParams({
    search: query,
    page: String(page),
    per_page: String(perPage),
    select: FIELDS,
    sort: SORT_OPTIONS[sort] ?? SORT_OPTIONS.relevance,
  });

  const url = `${config.openAlex.baseUrl}/works?${params}`;
  const data = await fetchJson(url);

  return {
    results: (data.results ?? []).map(toPaper),
    total: data.meta?.count ?? 0,
    page,
    perPage,
  };
}
