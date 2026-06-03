// Muestra UN paper. Componente de presentación puro: recibe el paper por props
// y solo lo dibuja. Reutilizable en resultados, favoritos o detalle.
export function PaperCard({ paper }) {
  const authors = formatAuthors(paper.authors);

  return (
    <article className="paper-card">
      <header className="paper-card__header">
        <h3 className="paper-card__title">{paper.title}</h3>
        {paper.isOpenAccess && (
          <span className="paper-card__badge" title="Acceso abierto">
            Acceso abierto
          </span>
        )}
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
          <a href={paper.pdfUrl} target="_blank" rel="noreferrer">
            📄 PDF
          </a>
        )}
        {paper.landingUrl && (
          <a href={paper.landingUrl} target="_blank" rel="noreferrer">
            🔗 Ver publicación
          </a>
        )}
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
