// Convierte un registro crudo de Crossref a NUESTRA forma de paper.
// El id se construye con el DOI ("doi:10..."), igual que en Semantic Scholar:
// así detalle y favoritos funcionan idéntico para cualquier motor.
export function toPaperFromCrossref(item) {
  const doi = item.DOI ?? null;

  return {
    id: doi ? `doi:${doi}` : null,
    doi: doi ? `https://doi.org/${doi}` : null,
    title: item.title?.[0] ?? "Sin título",
    abstract: cleanJatsAbstract(item.abstract),
    year: item.issued?.["date-parts"]?.[0]?.[0] ?? null,
    citations: item["is-referenced-by-count"] ?? 0,
    authors: (item.author ?? [])
      .map((author) => [author.given, author.family].filter(Boolean).join(" "))
      .filter(Boolean),
    venue: item["container-title"]?.[0] ?? null,
    isOpenAccess: false, // Crossref no informa acceso abierto de forma fiable
    pdfUrl: null,
    pdfSource: null,
    landingUrl: doi ? `https://doi.org/${doi}` : null,
    engine: "Crossref",
    hasDetail: true, // tiene vista de detalle enriquecida (por DOI)
  };
}

// Crossref entrega el abstract en XML JATS ("<jats:p>texto</jats:p>"):
// se quitan las etiquetas y se normalizan los espacios.
function cleanJatsAbstract(abstract) {
  if (!abstract) return null;
  const text = abstract.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 0 ? text : null;
}
