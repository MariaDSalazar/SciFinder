// OpenAlex no entrega el abstract como texto, sino como un "índice invertido":
//   { "Deep": [0], "learning": [1], "is": [2], ... }
// donde cada palabra apunta a las posiciones que ocupa en el texto.
// Esta función reconstruye el texto legible original a partir de ese índice.
export function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return null;

  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const position of positions) {
      words[position] = word;
    }
  }

  const text = words.join(" ").trim();
  return text.length > 0 ? text : null;
}
