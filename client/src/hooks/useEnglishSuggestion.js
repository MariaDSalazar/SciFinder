import { useEffect, useState } from "react";
import { translateText } from "../services/papersApi.js";

// Las APIs científicas indexan mayormente en INGLÉS: "cáncer" da miles de
// resultados, "cancer" da millones. Este hook traduce el término buscado
// (reutilizando nuestro /api/translate, cacheado 24 h en el backend) y, si la
// versión en inglés es distinta, la propone como sugerencia.
// Si la traducción falla, simplemente no hay sugerencia: nunca rompe nada.
export function useEnglishSuggestion(searchedQuery, status) {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    setSuggestion(null);
    if (status !== "success" || !searchedQuery) return;

    let cancelled = false;
    translateText(searchedQuery, "en")
      .then(({ translation }) => {
        if (cancelled) return;
        const english = translation.trim();
        if (english && english.toLowerCase() !== searchedQuery.trim().toLowerCase()) {
          setSuggestion(english);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [searchedQuery, status]);

  return suggestion;
}
