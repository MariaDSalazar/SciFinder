import { reconstructAbstract } from "../lib/reconstructAbstract.js";

// Convierte un "work" crudo de OpenAlex a la forma limpia y estable que consume
// el frontend. Si mañana cambiamos de fuente o agregamos otra, el frontend no se
// entera: solo este mapper conoce el formato externo. Es nuestro "contrato" de datos.
export function toPaper(work) {
  return {
    id: work.id,
    doi: work.doi ?? null,
    title: work.display_name ?? "Sin título",
    abstract: reconstructAbstract(work.abstract_inverted_index),
    year: work.publication_year ?? null,
    citations: work.cited_by_count ?? 0,
    authors: (work.authorships ?? [])
      .map((authorship) => authorship.author?.display_name)
      .filter(Boolean),
    venue: work.primary_location?.source?.display_name ?? null,
    isOpenAccess: work.open_access?.is_oa ?? false,
    pdfUrl: work.best_oa_location?.pdf_url ?? work.open_access?.oa_url ?? null,
    landingUrl: work.doi ?? work.id,
  };
}
