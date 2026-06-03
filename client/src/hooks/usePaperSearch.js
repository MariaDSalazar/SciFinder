import { useState, useCallback } from "react";
import { searchPapers } from "../services/papersApi.js";

// Hook reutilizable que encapsula TODO el estado de una búsqueda:
//   - status: idle | loading | success | error
//   - results / total: los datos
//   - error: mensaje si falla
//   - search(params): dispara la consulta
// Cualquier vista puede usarlo sin repetir la lógica de carga/error.
export function usePaperSearch() {
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const search = useCallback(async (params) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await searchPapers(params);
      setResults(data.results);
      setTotal(data.total);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setResults([]);
      setTotal(0);
      setStatus("error");
    }
  }, []);

  return { results, total, status, error, search };
}
