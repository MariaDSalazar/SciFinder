import { useEffect } from "react";
import { getPaper } from "../services/papersApi.js";
import { useRequest } from "./useRequest.js";

// Hook de detalle: carga automáticamente el paper cuando cambia el id.
// Reutiliza useRequest para no repetir la lógica de carga/error.
export function usePaperDetail(paperId) {
  const { data, status, error, run } = useRequest(getPaper);

  useEffect(() => {
    if (paperId) run(paperId);
  }, [paperId, run]);

  return { paper: data, status, error };
}
