import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { CITATION_FORMATS } from "../lib/citations.js";

// Caja de citas: deja elegir el formato (APA, MLA, Chicago, BibTeX),
// muestra la cita generada y permite copiarla al portapapeles.
export function CitationBox({ paper }) {
  const [formatId, setFormatId] = useState(CITATION_FORMATS[0].id);
  const [copied, setCopied] = useState(false);

  const activeFormat = CITATION_FORMATS.find((format) => format.id === formatId);
  const citation = activeFormat.format(paper);

  async function handleCopy() {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="citation-box">
      <div className="citation-box__controls">
        <select
          value={formatId}
          onChange={(event) => setFormatId(event.target.value)}
          aria-label="Formato de cita"
        >
          {CITATION_FORMATS.map((format) => (
            <option key={format.id} value={format.id}>
              {format.label}
            </option>
          ))}
        </select>

        <button type="button" onClick={handleCopy}>
          {copied ? (
            <>
              <Check size={14} aria-hidden="true" /> ¡Copiada!
            </>
          ) : (
            <>
              <Copy size={14} aria-hidden="true" /> Copiar
            </>
          )}
        </button>
      </div>

      <pre className="citation-box__text">{citation}</pre>
    </div>
  );
}
