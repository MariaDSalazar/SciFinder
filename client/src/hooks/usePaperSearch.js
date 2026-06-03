import { searchPapers } from "../services/papersApi.js";
import { useRequest } from "./useRequest.js";

// Hook de búsqueda: especializa useRequest para /api/search y
// expone los datos con nombres cómodos para la vista.
export function usePaperSearch() {
  const { data, status, error, run } = useRequest(searchPapers);

  return {
    results: data?.results ?? [],
    total: data?.total ?? 0,
    yearRange: data?.yearRange ?? null,
    status,
    error,
    search: run,
  };
}
