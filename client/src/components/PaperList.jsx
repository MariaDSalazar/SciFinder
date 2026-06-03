import { PaperCard } from "./PaperCard.jsx";

// Dibuja la lista de papers. Usa el OpenAlex id como key (es único).
export function PaperList({ papers }) {
  return (
    <div className="paper-list">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
}
