import { useEffect, useState } from "react";
import { StatusMessage } from "./StatusMessage.jsx";

// Si la carga supera este tiempo, asumimos que el servidor gratuito
// está despertando (Render lo duerme tras ~15 min sin uso).
const SLOW_THRESHOLD_MS = 8000;

// Mensaje de carga con conciencia de "servidor dormido": muestra el texto
// normal y, si la espera se alarga, explica qué está pasando para que el
// visitante no crea que la app está rota. Reutilizable en búsqueda y detalle.
export function LoadingMessage({ children }) {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsSlow(true), SLOW_THRESHOLD_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <StatusMessage spinner>
      {isSlow
        ? "El servidor gratuito está despertando, dame unos segunditos... ⏳"
        : children}
    </StatusMessage>
  );
}
