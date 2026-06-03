// Validaciones compartidas entre controladores.

// Id corto de OpenAlex: "W" seguido de dígitos (ej. W2741809807).
const OPENALEX_ID_PATTERN = /^W\d+$/i;

export function isOpenAlexId(value) {
  return typeof value === "string" && OPENALEX_ID_PATTERN.test(value);
}
