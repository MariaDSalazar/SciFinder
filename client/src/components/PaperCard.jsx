// Muestra UN paper. Componente de presentación puro: recibe el paper por props
// y solo lo dibuja. Se reutiliza igual en resultados de búsqueda y en favoritos.
// Avisa al padre con onSelect(id) (abrir detalle) y onToggleFavorite(paper) (⭐).
export function PaperCard({ paper, onSelect, isFavorite, onToggleFavorite }) {
  const authors = formatAuthors(paper.authors);
  const saved = isFavorite(paper.id);

  return (
    <article className="paper-card">
      <header className="paper-card__header">
        <h3 className="paper-card__title">
          <button
            className="paper-card__title-button"
            type="button"
            onClick={() => onSelect(paper.id)}
          >
            {paper.title}
          </button>
        </h3>
        {paper.isOpenAccess && (
          <span className="paper-card__badge" title="Acceso abierto">
            Acceso abierto
          </span>
        )}
        <button
          className={saved ? "paper-card__fav paper-card__fav--active" : "paper-card__fav"}
          type="button"
          onClick={() => onToggleFavorite(paper)}
          title={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
          aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
        >
          {saved ? "⭐" : "☆"}
        </button>
      </header>

      <p className="paper-card__meta">
        {authors && <span>{authors}</span>}
        {paper.venue && <span> · {paper.venue}</span>}
        {paper.year && <span> · {paper.year}</span>}
      </p>

      {paper.abstract && <p className="paper-card__abstract">{paper.abstract}</p>}

      <footer className="paper-card__footer">
        <span className="paper-card__citations">
          {paper.citations.toLocaleString("es")} citas
        </span>
        {paper.pdfUrl && (
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noreferrer"
            title={paper.pdfSource ? `PDF alojado en ${paper.pdfSource}` : "PDF de acceso abierto"}
          >
            📄 PDF{paper.pdfSource ? ` · ${paper.pdfSource}` : ""}
          </a>
        )}
        {paper.landingUrl && (
          <a href={paper.landingUrl} target="_blank" rel="noreferrer">
            🔗 Ver publicación
          </a>
        )}
        <button
          className="paper-card__details"
          type="button"
          onClick={() => onSelect(paper.id)}
        >
          Ver detalles
        </button>
      </footer>
    </article>
  );
}

// Une los autores en un texto corto; si son muchos, resume con "et al.".
function formatAuthors(authors) {
  if (!authors || authors.length === 0) return null;
  if (authors.length <= 3) return authors.join(", ");
  return `${authors.slice(0, 3).join(", ")} et al.`;
}
