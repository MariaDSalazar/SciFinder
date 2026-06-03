import { useEffect, useMemo, useState } from "react";
import { addFavorite, getFavorites, removeFavorite } from "../services/papersApi.js";

// Estado de favoritos de toda la página: carga la lista al iniciar y permite
// alternar (guardar/quitar) manteniéndola sincronizada con el backend.
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getFavorites()
      .then(setFavorites)
      .catch((err) => setError(err.message));
  }, []);

  // Set de ids para consultar "¿es favorito?" sin recorrer la lista cada vez.
  const favoriteIds = useMemo(() => new Set(favorites.map((paper) => paper.id)), [favorites]);

  async function toggleFavorite(paper) {
    setError(null);
    try {
      if (favoriteIds.has(paper.id)) {
        await removeFavorite(paper.id);
        setFavorites((previous) => previous.filter((item) => item.id !== paper.id));
      } else {
        const saved = await addFavorite(paper);
        setFavorites((previous) => [saved, ...previous]);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    favorites,
    error,
    isFavorite: (paperId) => favoriteIds.has(paperId),
    toggleFavorite,
  };
}
