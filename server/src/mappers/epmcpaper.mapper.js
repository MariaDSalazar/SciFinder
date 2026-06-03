// Convierte un registro crudo de Europe PMC a NUESTRA forma de paper.
// Igual que con los demás motores: id por DOI ("doi:10...") para que
// detalle y favoritos funcionen idéntico.
export function toPaperFromEuropePmc(result) {
  const doi = result.doi ?? null;

  return {
    id: doi ? `doi:${doi}` : null,
    doi: doi ? `https://doi.org/${doi}` : null,
    title: result.title ?? "Sin título",
    abstract: result.abstractText ?? null,
    year: result.pubYear ? Number.parseInt(result.pubYear, 10) : null,
    citations: result.citedByCount ?? 0,
    authors: extractAuthors(result),
    venue: result.journalTitle ?? result.journalInfo?.journal?.title ?? null,
    isOpenAccess: result.isOpenAccess === "Y",
    pdfUrl: extractPdfUrl(result),
    pdfSource: extractPdfUrl(result) ? "Europe PMC" : null,
    landingUrl: doi ? `https://doi.org/${doi}` : null,
    engine: "Europe PMC",
  };
}

// Prefiere la lista estructurada de autores; si no llega, separa el texto plano
// "Smith J, Doe A." que entrega Europe PMC.
function extractAuthors(result) {
  const structured = result.authorList?.author
    ?.map((author) => author.fullName)
    .filter(Boolean);
  if (structured?.length > 0) return structured;

  if (typeof result.authorString === "string" && result.authorString.length > 0) {
    return result.authorString.replace(/\.$/, "").split(", ");
  }
  return [];
}

// Busca el enlace al PDF de acceso abierto entre los enlaces de texto completo.
function extractPdfUrl(result) {
  const links = result.fullTextUrlList?.fullTextUrl ?? [];
  return links.find((link) => link.documentStyle === "pdf")?.url ?? null;
}
