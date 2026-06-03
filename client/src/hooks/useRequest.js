import { useState, useCallback } from "react";

// Hook genérico y reutilizable: maneja el ciclo de vida de CUALQUIER llamada
// asíncrona (status: idle | loading | success | error, datos y mensaje de error).
// Sobre él se construyen usePaperSearch y usePaperDetail sin repetir lógica.
export function useRequest(requestFn) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setStatus("loading");
      setError(null);
      try {
        const result = await requestFn(...args);
        setData(result);
        setStatus("success");
      } catch (err) {
        setData(null);
        setError(err.message);
        setStatus("error");
      }
    },
    [requestFn],
  );

  return { data, status, error, run };
}
