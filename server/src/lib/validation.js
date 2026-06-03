// Validaciones compartidas entre controladores.

// Id corto de OpenAlex: "W" seguido de dígitos (ej. W2741809807).
const OPENALEX_ID_PATTERN = /^W\d+$/i;
// Id por DOI (motores Semantic Scholar / Crossref / Europe PMC): "doi:10...".
const DOI_ID_PATTERN = /^doi:10\.\S+$/i;
// Id de ERIC (educación, sin DOI): "eric:EJ1025578".
const ERIC_ID_PATTERN = /^eric:\w+$/i;

// Id válido de paper en NUESTRA API (cualquier motor).
// Los W... y doi:... además tienen detalle enriquecido vía OpenAlex.
export function isPaperId(value) {
  return (
    typeof value === "string" &&
    (OPENALEX_ID_PATTERN.test(value) || DOI_ID_PATTERN.test(value) || ERIC_ID_PATTERN.test(value))
  );
}
