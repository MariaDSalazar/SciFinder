import { PaperList } from "./PaperList.jsx";
import { StatusMessage } from "./StatusMessage.jsx";

// Pestaña de favoritos: reutiliza PaperList/PaperCard, igual que los resultados.
export function FavoritesView({ favoritesState, onSelectPaper }) {
  const { favorites, error, isFavorite, toggleFavorite } = favoritesState;

  if (error) {
    return <StatusMessage icon="⚠️">{error}</StatusMessage>;
  }
  if (favorites.length === 0) {
    return (
      <StatusMessage icon="⭐">
        Aún no tienes favoritos. Marca la estrella ☆ de un paper para guardarlo aquí.
      </StatusMessage>
    );
  }

  return (
    <PaperList
      papers={favorites}
      onSelectPaper={onSelectPaper}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
    />
  );
}
