// Validaciones compartidas entre controladores.

// Id corto de OpenAlex: "W" seguido de dígitos (ej. W2741809807).
const OPENALEX_ID_PATTERN = /^W\d+$/i;
// Id por DOI (lo usan los resultados de Semantic Scholar): "doi:10...".
const DOI_ID_PATTERN = /^doi:10\.\S+$/i;

// Id válido de paper en NUESTRA API: cualquiera de las dos formas.
// OpenAlex resuelve ambas en su endpoint de detalle.
export function isPaperId(value) {
  return (
    typeof value === "string" &&
    (OPENALEX_ID_PATTERN.test(value) || DOI_ID_PATTERN.test(value))
  );
}
