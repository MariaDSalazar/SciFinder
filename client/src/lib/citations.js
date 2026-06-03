// Generadores de citas bibliográficas a partir de un paper (forma del backend).
// Funciones puras: reciben datos, devuelven texto. Sin estado ni efectos.
// Nota: separar nombre/apellido desde un nombre plano es una aproximación
// (tomamos la última palabra como apellido), suficiente para citas de cortesía.

// Divide "Leo Breiman" → { given: "Leo", family: "Breiman" }.
function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  const family = parts.pop();
  return { given: parts.join(" "), family };
}

// "Leo" → "L."  |  "Ana María" → "A. M."
function toInitials(given) {
  return given
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}.`)
    .join(" ");
}

// ── APA 7 ───────────────────────────────────────────
function apaAuthors(authors) {
  const formatted = authors.map((name) => {
    const { given, family } = splitName(name);
    return given ? `${family}, ${toInitials(given)}` : family;
  });
  if (formatted.length === 0) return "";
  if (formatted.length === 1) return formatted[0];
  if (formatted.length <= 20) {
    return `${formatted.slice(0, -1).join(", ")}, & ${formatted.at(-1)}`;
  }
  // Regla APA 7 para 21+ autores: los primeros 19, puntos suspensivos y el último.
  return `${formatted.slice(0, 19).join(", ")}, ... ${formatted.at(-1)}`;
}

function formatApa(paper) {
  const pieces = [];
  const authors = apaAuthors(paper.authors);
  if (authors) pieces.push(authors);
  pieces.push(`(${paper.year ?? "s. f."}).`);
  pieces.push(`${paper.title}.`);
  if (paper.venue) pieces.push(`${paper.venue}.`);
  if (paper.doi) pieces.push(paper.doi);
  return pieces.join(" ");
}

// ── MLA 9 ───────────────────────────────────────────
function mlaAuthors(authors) {
  if (authors.length === 0) return "";
  const { given, family } = splitName(authors[0]);
  const first = given ? `${family}, ${given}` : family;
  if (authors.length === 1) return `${first}.`;
  if (authors.length === 2) return `${first}, and ${authors[1]}.`;
  return `${first}, et al.`;
}

function formatMla(paper) {
  const pieces = [];
  const authors = mlaAuthors(paper.authors);
  if (authors) pieces.push(authors);
  pieces.push(`"${paper.title}."`);
  if (paper.venue) pieces.push(`${paper.venue},`);
  if (paper.year) pieces.push(`${paper.year},`);
  if (paper.doi) pieces.push(`${paper.doi}.`);
  return pieces.join(" ");
}

// ── Chicago (autor-fecha) ───────────────────────────
function chicagoAuthors(authors) {
  if (authors.length === 0) return "";
  const { given, family } = splitName(authors[0]);
  const first = given ? `${family}, ${given}` : family;
  if (authors.length === 1) return `${first}.`;
  const rest = authors.slice(1);
  if (rest.length === 1) return `${first}, and ${rest[0]}.`;
  return `${first}, ${rest.slice(0, -1).join(", ")}, and ${rest.at(-1)}.`;
}

function formatChicago(paper) {
  const pieces = [];
  const authors = chicagoAuthors(paper.authors);
  if (authors) pieces.push(authors);
  if (paper.year) pieces.push(`${paper.year}.`);
  pieces.push(`"${paper.title}."`);
  if (paper.venue) pieces.push(`${paper.venue}.`);
  if (paper.doi) pieces.push(paper.doi);
  return pieces.join(" ");
}

// ── BibTeX ──────────────────────────────────────────
function formatBibtex(paper) {
  const firstAuthor = paper.authors[0] ? splitName(paper.authors[0]).family : "anon";
  const key = `${firstAuthor.toLowerCase()}${paper.year ?? ""}`;

  const fields = [
    `  title = {${paper.title}}`,
    paper.authors.length > 0 ? `  author = {${paper.authors.join(" and ")}}` : null,
    paper.venue ? `  journal = {${paper.venue}}` : null,
    paper.year ? `  year = {${paper.year}}` : null,
    paper.doi ? `  doi = {${paper.doi.replace("https://doi.org/", "")}}` : null,
  ].filter(Boolean);

  return `@article{${key},\n${fields.join(",\n")}\n}`;
}

// Lista única que consume la UI: agregar un formato nuevo = agregar una entrada.
export const CITATION_FORMATS = [
  { id: "apa", label: "APA 7", format: formatApa },
  { id: "mla", label: "MLA 9", format: formatMla },
  { id: "chicago", label: "Chicago", format: formatChicago },
  { id: "bibtex", label: "BibTeX", format: formatBibtex },
];
