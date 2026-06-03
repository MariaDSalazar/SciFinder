import { ApiError } from "../lib/ApiError.js";
import { cached, TTL } from "../lib/cache.js";
import { searchPapers } from "../services/search.service.js";
import { recordSearch } from "../services/history.service.js";

const DEFAULT_PER_PAGE = 25;
const MAX_PER_PAGE = 50;
const VALID_SORTS = ["relevance", "citations"];
const VALID_ENGINES = ["openalex", "semanticscholar", "crossref", "europepmc", "eric", "all"];

// Lee, valida y normaliza los parámetros de la query string.
// Mantiene al controlador delgado y deja la entrada en un formato seguro.
function parseSearchParams(query) {
  const term = (query.q ?? "").trim();
  if (!term) {
    throw new ApiError(400, "El parámetro 'q' (término de búsqueda) es obligatorio");
  }

  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);

  const requestedPerPage = Number.parseInt(query.perPage, 10) || DEFAULT_PER_PAGE;
  const perPage = Math.min(MAX_PER_PAGE, Math.max(1, requestedPerPage));

  const sort = VALID_SORTS.includes(query.sort) ? query.sort : "relevance";
  const engine = VALID_ENGINES.includes(query.engine) ? query.engine : "openalex";

  const fromYear = parseYear(query.fromYear);
  const toYear = parseYear(query.toYear);

  return { query: term, page, perPage, sort, engine, fromYear, toYear };
}

// Convierte un año a número; devuelve undefined si no es válido (así se ignora el filtro).
function parseYear(value) {
  const year = Number.parseInt(value, 10);
  return Number.isNaN(year) ? undefined : year;
}

// GET /api/search — orquesta: validar entrada → buscar → responder.
// Los errores se delegan al manejador central con next(error).
export async function handleSearch(req, res, next) {
  try {
    const params = parseSearchParams(req.query);

    // Misma búsqueda (mismos parámetros) dentro de 5 min → sale de la caché
    // sin tocar las APIs externas.
    const { value: data, hit } = await cached(
      `search:${JSON.stringify(params)}`,
      TTL.search,
      () => searchPapers(params),
    );

    // El historial se guarda "en segundo plano": si fallara,
    // no debe afectar la respuesta de la búsqueda.
    recordSearch({ query: params.query, total: data.total }).catch(() => {});

    res.set("X-Cache", hit ? "HIT" : "MISS");
    res.json(data);
  } catch (error) {
    next(error);
  }
}
