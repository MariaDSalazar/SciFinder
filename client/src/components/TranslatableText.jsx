import { useState } from "react";
import { Languages, TriangleAlert } from "lucide-react";
import { translateText } from "../services/papersApi.js";

// Idiomas ofrecidos. "original" no llama a la API: vuelve al texto tal cual.
const LANG_OPTIONS = [
  { id: "original", label: "Original" },
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
];

// Texto con opción de traducción. Componente reutilizable: se usa igual para
// el TLDR, el abstract o cualquier otro texto. Cachea las traducciones ya
// pedidas para no repetir llamadas al cambiar de idioma.
export function TranslatableText({ text }) {
  const [lang, setLang] = useState("original");
  const [translations, setTranslations] = useState({});
  const [loadingLang, setLoadingLang] = useState(null);
  const [error, setError] = useState(null);

  async function handleSelect(targetLang) {
    setError(null);

    // El original y las traducciones ya cacheadas no requieren llamada.
    if (targetLang === "original" || translations[targetLang]) {
      setLang(targetLang);
      return;
    }

    setLoadingLang(targetLang);
    try {
      const { translation } = await translateText(text, targetLang);
      setTranslations((previous) => ({ ...previous, [targetLang]: translation }));
      setLang(targetLang);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingLang(null);
    }
  }

  const displayedText = lang === "original" ? text : translations[lang];

  return (
    <div className="translatable">
      <p>{displayedText}</p>

      <div className="translatable__controls">
        <span className="translatable__label">
          <Languages size={13} aria-hidden="true" /> Ver en:
        </span>
        {LANG_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={
              lang === option.id
                ? "translatable__lang translatable__lang--active"
                : "translatable__lang"
            }
            onClick={() => handleSelect(option.id)}
            disabled={loadingLang !== null}
          >
            {loadingLang === option.id ? "Traduciendo..." : option.label}
          </button>
        ))}
        {error && (
          <span className="translatable__error">
            <TriangleAlert size={13} aria-hidden="true" /> {error}
          </span>
        )}
      </div>
    </div>
  );
}
