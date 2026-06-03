import { ApiError } from "../lib/ApiError.js";
import { searchPapers } from "../services/openalex.service.js";

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

  return { query: term, page, perPage, sort };
}

// GET /api/search — orquesta: validar entrada → buscar → responder.
// Los errores se delegan al manejador central con next(error).
export async function handleSearch(req, res, next) {
  try {
    const params = parseSearchParams(req.query);
    const data = await searchPapers(params);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
