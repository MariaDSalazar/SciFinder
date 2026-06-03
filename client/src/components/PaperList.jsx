import { PaperCard } from "./PaperCard.jsx";

// Dibuja la lista de papers y propaga la selección al padre.
// Usa el id de OpenAlex como key (es único).
export function PaperList({ papers, onSelectPaper }) {
  return (
    <div className="paper-list">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} onSelect={onSelectPaper} />
      ))}
    </div>
  );
}
