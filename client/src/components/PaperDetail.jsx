import { usePaperDetail } from "../hooks/usePaperDetail.js";
import { StatusMessage } from "./StatusMessage.jsx";
import { CitationBox } from "./CitationBox.jsx";
import { TranslatableText } from "./TranslatableText.jsx";

// Modal con el detalle completo de un paper, enriquecido por el backend con
// TLDR (resumen IA) y citas influyentes de Semantic Scholar.
// Se cierra con el botón ✕ o haciendo click fuera del recuadro.
export function PaperDetail({ paperId, onClose }) {
  const { paper, status, error } = usePaperDetail(paperId);

  return (
    <div className="modal" onClick={onClose} role="presentation">
      <div className="modal__content" onClick={(event) => event.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Cerrar detalle">
          ✕
        </button>

        {status === "loading" && <StatusMessage icon="⏳">Cargando detalle...</StatusMessage>}
        {status === "error" && <StatusMessage icon="⚠️">{error}</StatusMessage>}
        {status === "success" && paper && <PaperDetailContent paper={paper} />}
      </div>
    </div>
  );
}

// Contenido del detalle (separado para que el modal quede legible).
function PaperDetailContent({ paper }) {
  return (
    <article className="paper-detail">
      <h2 className="paper-detail__title">{paper.title}</h2>

      <p className="paper-detail__meta">
        {paper.venue && <span>{paper.venue}</span>}
        {paper.year && <span> · {paper.year}</span>}
        {paper.isOpenAccess && <span className="paper-card__badge"> Acceso abierto</span>}
      </p>

      {paper.authors.length > 0 && (
        <p className="paper-detail__authors">{paper.authors.join(", ")}</p>
      )}

      <div className="paper-detail__stats">
        <span>📊 {paper.citations.toLocaleString("es")} citas</span>
        {paper.influentialCitations !== null && (
          <span title="Citas que influyeron de forma significativa en otros trabajos (Semantic Scholar)">
            ⭐ {paper.influentialCitations.toLocaleString("es")} citas influyentes
          </span>
        )}
      </div>

      {paper.tldr && (
        <section className="paper-detail__section paper-detail__tldr">
          <h3>🤖 Resumen IA (TLDR)</h3>
          <TranslatableText text={paper.tldr} />
        </section>
      )}

      {paper.abstract && (
        <section className="paper-detail__section">
          <h3>Abstract</h3>
          <TranslatableText text={paper.abstract} />
        </section>
      )}

      <section className="paper-detail__section">
        <h3>📋 Citar este paper</h3>
        <CitationBox paper={paper} />
      </section>

      <footer className="paper-detail__links">
        {paper.pdfUrl && (
          <a href={paper.pdfUrl} target="_blank" rel="noreferrer">
            📄 Ver PDF
          </a>
        )}
        {paper.landingUrl && (
          <a href={paper.landingUrl} target="_blank" rel="noreferrer">
            🔗 Ver publicación (DOI)
          </a>
        )}
      </footer>
    </article>
  );
}
