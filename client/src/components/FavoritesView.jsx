import { Bookmark, Star, TriangleAlert } from "lucide-react";
import { PaperList } from "./PaperList.jsx";
import { StatusMessage } from "./StatusMessage.jsx";

// Pestaña de favoritos, AGRUPADOS por el tema con el que se buscaron.
// Reutiliza PaperList/PaperCard, igual que los resultados de búsqueda.
export function FavoritesView({ favoritesState, onSelectPaper }) {
  const { favorites, error, isFavorite, toggleFavorite } = favoritesState;

  if (error) {
    return (
      <StatusMessage icon={<TriangleAlert size={44} strokeWidth={1.5} aria-hidden="true" />}>
        {error}
      </StatusMessage>
    );
  }
  if (favorites.length === 0) {
    return (
      <StatusMessage icon={<Star size={44} strokeWidth={1.5} aria-hidden="true" />}>
        Aún no tienes favoritos. Marca la estrella <Star size={13} aria-hidden="true" /> de un
        paper para guardarlo aquí.
      </StatusMessage>
    );
  }

  const groups = groupByTopic(favorites);

  return (
    <>
      {Object.entries(groups).map(([topic, papers]) => (
        <section key={topic} className="favorites-group">
          <h2 className="favorites-group__title">
            <Bookmark size={17} aria-hidden="true" /> {topic}{" "}
            <span className="favorites-group__count">({papers.length})</span>
          </h2>
          <PaperList
            papers={papers}
            onSelectPaper={onSelectPaper}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </section>
      ))}
    </>
  );
}

// Agrupa los favoritos por tema; los guardados sin tema van a "Sin tema".
function groupByTopic(favorites) {
  const groups = {};
  for (const paper of favorites) {
    const key = paper.topic?.trim() || "Sin tema";
    (groups[key] ??= []).push(paper);
  }
  return groups;
}
