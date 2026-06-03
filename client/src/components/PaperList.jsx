import { PaperCard } from "./PaperCard.jsx";

// Dibuja la lista de papers y propaga selección y favoritos al padre.
// Usa el id de OpenAlex como key (es único).
export function PaperList({ papers, onSelectPaper, isFavorite, onToggleFavorite }) {
  return (
    <div className="paper-list">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          onSelect={onSelectPaper}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
