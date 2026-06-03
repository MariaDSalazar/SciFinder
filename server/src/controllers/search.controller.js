import { ApiError } from "../lib/ApiError.js";
import { searchPapers } from "../services/openalex.service.js";
import { recordSearch } from "../services/history.service.js";

const DEFAULT_PER_PAGE = 25;
const MAX_PER_PAGE = 50;
const VALID_SORTS = ["relevance", "citations"];

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

  const fromYear = parseYear(query.fromYear);
  const toYear = parseYear(query.toYear);

  return { query: term, page, perPage, sort, fromYear, toYear };
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
    const data = await searchPapers(params);

    // El historial se guarda "en segundo plano": si fallara,
    // no debe afectar la respuesta de la búsqueda.
    recordSearch({ query: params.query, total: data.total }).catch(() => {});

    res.json(data);
  } catch (error) {
    next(error);
  }
}
