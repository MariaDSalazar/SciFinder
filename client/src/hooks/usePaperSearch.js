import { useRef, useState } from "react";
import { searchPapers } from "../services/papersApi.js";

// Hook de búsqueda con paginación acumulativa:
//   search(params) → nueva búsqueda (página 1, reemplaza resultados)
//   loadMore()     → trae la siguiente página y la AGREGA al final
// Igual que useRequest, descarta respuestas viejas si llega algo más nuevo.
export function usePaperSearch() {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [totals, setTotals] = useState(null);
  const [yearRange, setYearRange] = useState(null);
  const [byYear, setByYear] = useState([]);
  const [status, setStatus] = useState("idle");
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchedQuery, setSearchedQuery] = useState(null); // término de la última búsqueda

  const lastParamsRef = useRef(null); // parámetros de la última búsqueda (para pedir más páginas)
  const pageRef = useRef(1);
  const requestIdRef = useRef(0);

  async function search(params) {
    const requestId = ++requestIdRef.current;
    lastParamsRef.current = params;
    pageRef.current = 1;
    setSearchedQuery(params.query);
    setStatus("loading");
    setError(null);
    try {
      const data = await searchPapers({ ...params, page: 1 });
      if (requestId !== requestIdRef.current) return; // llegó tarde: hay una búsqueda más nueva
      setResults(data.results);
      setTotal(data.total);
      setTotals(data.totals);
      setYearRange(data.yearRange);
      setByYear(data.byYear);
      setStatus("success");
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setResults([]);
      setTotal(0);
      setTotals(null);
      setError(err.message);
      setStatus("error");
    }
  }

  async function loadMore() {
    if (!lastParamsRef.current || loadingMore) return;
    const requestId = requestIdRef.current; // si llega una búsqueda nueva, esta página se descarta
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      const data = await searchPapers({ ...lastParamsRef.current, page: nextPage });
      if (requestId !== requestIdRef.current) return;
      pageRef.current = nextPage;
      // Algunos motores pueden repetir papers entre páginas → se filtran por id.
      setResults((previous) => appendUnique(previous, data.results));
    } catch {
      // Silencioso a propósito: el botón "Cargar más" queda disponible para reintentar.
    } finally {
      if (requestId === requestIdRef.current) setLoadingMore(false);
    }
  }

  return {
    results,
    total,
    totals,
    yearRange,
    byYear,
    status,
    error,
    searchedQuery,
    loadingMore,
    // Hay más por cargar mientras tengamos menos resultados que el total.
    hasMore: results.length > 0 && results.length < total,
    search,
    loadMore,
  };
}

// Agrega los nuevos resultados evitando duplicados (mismo id = mismo paper).
function appendUnique(current, incoming) {
  const seen = new Set(current.map((paper) => paper.id));
  return [...current, ...incoming.filter((paper) => !seen.has(paper.id))];
}
