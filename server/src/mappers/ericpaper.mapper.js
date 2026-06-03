// Convierte un registro crudo de ERIC (educación) a NUESTRA forma de paper.
// ERIC NO entrega DOI ni conteo de citas, así que:
//  - el id usa su identificador propio ("eric:EJ1025578"),
//  - hasDetail es false: no hay vista de detalle enriquecida (el enlace lleva
//    a la ficha oficial en eric.ed.gov),
//  - citations queda en 0 (ERIC no publica esa métrica).
export function toPaperFromEric(record) {
  return {
    id: `eric:${record.id}`,
    doi: null,
    title: record.title ?? "Sin título",
    abstract: record.description ?? null,
    year: record.publicationdateyear ?? null,
    citations: 0,
    authors: record.author ?? [],
    venue: record.source ?? null,
    isOpenAccess: record.e_fulltextauth === true,
    pdfUrl: record.e_fulltextauth === true
      ? `https://files.eric.ed.gov/fulltext/${record.id}.pdf`
      : null,
    pdfSource: record.e_fulltextauth === true ? "ERIC" : null,
    landingUrl: `https://eric.ed.gov/?id=${record.id}`,
    engine: "ERIC",
    hasDetail: false,
  };
}
