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

  // La búsqueda y las estadísticas por año van en paralelo (no se suman las
  // esperas). Son secundarias: si fallan, la búsqueda sale igual.
  const [data, yearStats] = await Promise.all([
    fetchJson(url),
    getYearStats(query).catch(() => null),
  ]);

  return {
    results: (data.results ?? []).map(toPaper),
    total: data.meta?.count ?? 0,
    page,
    perPage,
    yearRange: yearStats ? { from: yearStats.from, to: yearStats.to } : null,
    byYear: yearStats?.byYear ?? [],
  };
}

// Estadísticas por año para una búsqueda, usando la agregación de OpenAlex
// (group_by=publication_year). Devuelve el rango {from, to} y la serie
// byYear [{year, count}] para graficar la producción del tema.
// Exportada porque el orquestador (search.service) también la usa cuando
// el motor elegido es Semantic Scholar: las estadísticas del TEMA son las mismas.
// OpenAlex trae registros mal fechados (ej. un paper de "1403" sobre machine
// learning, o años futuros de artículos "in press"); para no mostrar rangos
// absurdos, se descartan los años futuros y los que tienen una cantidad
// insignificante de papers (< 0.01% del total).
export async function getYearStats(query) {
  const params = new URLSearchParams({ search: query, group_by: "publication_year" });
  const data = await fetchJson(`${config.openAlex.baseUrl}/works?${params}`);

  const groups = (data.group_by ?? [])
    .map((group) => ({ year: Number.parseInt(group.key, 10), count: group.count }))
    .filter((group) => Number.isFinite(group.year) && group.count > 0);

  const totalPapers = groups.reduce((sum, group) => sum + group.count, 0);
  const minCount = Math.max(1, Math.ceil(totalPapers * 0.0001));
  const currentYear = new Date().getFullYear();

  const byYear = groups
    .filter((group) => group.count >= minCount && group.year <= currentYear)
    .sort((a, b) => a.year - b.year);

  if (byYear.length === 0) return null;
  return {
    from: byYear[0].year,
    to: byYear[byYear.length - 1].year,
    byYear,
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
