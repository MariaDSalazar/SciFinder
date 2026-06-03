// Convierte un paper crudo de Semantic Scholar a NUESTRA forma de paper
// (la misma que produce paper.mapper.js para OpenAlex). El id se construye
// con el DOI ("doi:10..."): así el detalle y los favoritos funcionan igual,
// porque OpenAlex acepta búsquedas por DOI.
export function toPaperFromS2(s2Paper) {
  const doi = s2Paper.externalIds?.DOI ?? null;

  return {
    id: doi ? `doi:${doi}` : null,
    doi: doi ? `https://doi.org/${doi}` : null,
    title: s2Paper.title ?? "Sin título",
    abstract: s2Paper.abstract ?? null,
    year: s2Paper.year ?? null,
    citations: s2Paper.citationCount ?? 0,
    authors: (s2Paper.authors ?? []).map((author) => author.name).filter(Boolean),
    venue: s2Paper.venue || null,
    isOpenAccess: s2Paper.isOpenAccess ?? false,
    pdfUrl: s2Paper.openAccessPdf?.url ?? null,
    pdfSource: s2Paper.openAccessPdf ? "Semantic Scholar (OA)" : null,
    landingUrl: doi ? `https://doi.org/${doi}` : null,
    engine: "Semantic Scholar",
    hasDetail: true, // tiene vista de detalle enriquecida (por DOI)
  };
}
