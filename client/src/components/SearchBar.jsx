import { useEffect, useRef } from "react";

// Opciones centralizadas para no repetir cadenas mágicas.
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "citations", label: "Más citados" },
];

const ENGINE_OPTIONS = [
  { value: "openalex", label: "OpenAlex" },
  { value: "semanticscholar", label: "Semantic Scholar" },
  { value: "crossref", label: "Crossref" },
  { value: "europepmc", label: "Europe PMC" },
  { value: "eric", label: "ERIC (educación)" },
  { value: "all", label: "Todos los motores" },
];

// Milisegundos de espera tras cambiar un filtro antes de re-buscar solo.
// Evita disparar una búsqueda por cada dígito al escribir un año, y respeta
// el ritmo de Semantic Scholar (~1 petición/segundo con API key).
const AUTO_SEARCH_DELAY = 1000;

// Caja de búsqueda totalmente controlada: TODO el estado (término, años,
// orden y motor) vive en el padre — única fuente de verdad para que las
// búsquedas desde "recientes", la gráfica o la sugerencia en inglés respeten
// siempre los filtros visibles. Al cambiar cualquier filtro con un tema
// escrito, re-busca automáticamente.
export function SearchBar({
  query,
  onQueryChange,
  fromYear,
  onFromYearChange,
  toYear,
  onToYearChange,
  sort,
  onSortChange,
  engine,
  onEngineChange,
  onSearch,
  disabled,
  yearRange,
}) {
  // Límites de los campos de año: el rango real si lo conocemos; si no, uno amplio.
  const minYear = yearRange?.from ?? 1500;
  const maxYear = yearRange?.to ?? new Date().getFullYear();

  function handleSubmit(event) {
    event.preventDefault();
    if (!query.trim()) return;
    onSearch();
  }

  function handleClearYears() {
    onFromYearChange("");
    onToYearChange("");
  }

  // Re-búsqueda automática al cambiar filtros (no al escribir el tema:
  // para el tema está el botón Buscar / Enter). Se omite el primer render.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!query.trim()) return;

    const timer = setTimeout(onSearch, AUTO_SEARCH_DELAY);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo filtros: el tema se busca con el botón
  }, [fromYear, toYear, sort, engine]);

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-bar__input"
        type="text"
        placeholder="Busca un tema (ej. machine learning, cáncer, energía solar...)"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        aria-label="Término de búsqueda"
      />

      <div className="search-bar__filters">
        <label className="search-bar__field">
          Desde
          <input
            type="number"
            min={minYear}
            max={maxYear}
            placeholder={String(minYear)}
            value={fromYear}
            onChange={(event) => onFromYearChange(event.target.value)}
          />
        </label>

        <label className="search-bar__field">
          Hasta
          <input
            type="number"
            min={minYear}
            max={maxYear}
            placeholder={String(maxYear)}
            value={toYear}
            onChange={(event) => onToYearChange(event.target.value)}
          />
        </label>

        {(fromYear || toYear) && (
          <button
            className="search-bar__clear-years"
            type="button"
            onClick={handleClearYears}
            title="Quitar el filtro de años"
          >
            ✕ Quitar años
          </button>
        )}

        <label className="search-bar__field">
          Orden
          <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="search-bar__field">
          Motor
          <select value={engine} onChange={(event) => onEngineChange(event.target.value)}>
            {ENGINE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button className="search-bar__submit" type="submit" disabled={disabled}>
          {disabled ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {yearRange && (
        <p className="search-bar__hint">
          📅 Hay papers sobre este tema desde <strong>{yearRange.from}</strong> hasta{" "}
          <strong>{yearRange.to}</strong>. Al cambiar los filtros, la búsqueda se actualiza sola.
        </p>
      )}
    </form>
  );
}
