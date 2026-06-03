// Algunas fuentes entregan los abstracts con marcado dentro del texto:
// Crossref usa XML JATS ("<jats:p>...</jats:p>") y Europe PMC mete HTML
// ("<h4>Purpose</h4>..."). Esta utilidad quita las etiquetas y normaliza
// los espacios para mostrar texto limpio.
export function stripMarkup(text) {
  if (!text) return null;
  const clean = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > 0 ? clean : null;
}
