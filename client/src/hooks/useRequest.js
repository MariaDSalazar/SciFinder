import { useState, useCallback, useRef } from "react";

// Hook genérico y reutilizable: maneja el ciclo de vida de CUALQUIER llamada
// asíncrona (status: idle | loading | success | error, datos y mensaje de error).
// Sobre él se construyen usePaperSearch y usePaperDetail sin repetir lógica.
// Si se dispara una llamada nueva mientras otra sigue en vuelo, la respuesta
// vieja se descarta: solo la más reciente toca el estado (evita "carreras").
export function useRequest(requestFn) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);

  const run = useCallback(
    async (...args) => {
      const requestId = ++requestIdRef.current;
      setStatus("loading");
      setError(null);
      try {
        const result = await requestFn(...args);
        if (requestId !== requestIdRef.current) return; // llegó tarde: ya hay otra más nueva
        setData(result);
        setStatus("success");
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setData(null);
        setError(err.message);
        setStatus("error");
      }
    },
    [requestFn],
  );

  return { data, status, error, run };
}
