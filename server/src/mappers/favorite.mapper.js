// Conversión entre la forma "paper" (la que usa el frontend) y el registro
// de la tabla FavoritePaper. SQLite no tiene arrays, así que los autores
// se guardan como JSON en texto y se convierten aquí, de ida y de vuelta.

export function toFavoriteRecord(paper) {
  return {
    id: paper.id,
    title: paper.title,
    authors: JSON.stringify(paper.authors ?? []),
    venue: paper.venue ?? null,
    year: paper.year ?? null,
    citations: paper.citations ?? 0,
    doi: paper.doi ?? null,
    pdfUrl: paper.pdfUrl ?? null,
    landingUrl: paper.landingUrl ?? null,
    isOpenAccess: paper.isOpenAccess ?? false,
    abstract: paper.abstract ?? null,
    topic: paper.topic ?? null,
  };
}

export function toPaperFromRecord(record) {
  return {
    id: record.id,
    title: record.title,
    authors: JSON.parse(record.authors),
    venue: record.venue,
    year: record.year,
    citations: record.citations,
    doi: record.doi,
    pdfUrl: record.pdfUrl,
    landingUrl: record.landingUrl,
    isOpenAccess: record.isOpenAccess,
    abstract: record.abstract,
    topic: record.topic,
    savedAt: record.savedAt,
    // Solo los ids de OpenAlex (W...) o por DOI tienen detalle enriquecido;
    // los de ERIC ("eric:...") enlazan a su ficha oficial.
    hasDetail: !record.id.startsWith("eric:"),
  };
}
