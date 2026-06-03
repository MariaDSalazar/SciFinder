import { useEffect, useState } from "react";
import { getRecentSearches } from "../services/papersApi.js";

// Chips con las últimas búsquedas (guardadas en el backend).
// Si no hay historial o falla la carga, simplemente no se muestra nada.
export function RecentSearches({ onPick }) {
  const [searches, setSearches] = useState([]);

  useEffect(() => {
    getRecentSearches()
      .then(setSearches)
      .catch(() => setSearches([]));
  }, []);

  if (searches.length === 0) return null;

  return (
    <div className="recent-searches">
      <span className="recent-searches__label">🕘 Búsquedas recientes:</span>
      {searches.map((item) => (
        <button
          key={item.query}
          type="button"
          className="recent-searches__chip"
          onClick={() => onPick(item.query)}
        >
          {item.query}
        </button>
      ))}
    </div>
  );
}
