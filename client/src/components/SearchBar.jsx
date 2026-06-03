import { useEffect, useRef, useState } from "react";

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
  { value: "all", label: "Todos los motores" },
];

// Milisegundos de espera tras cambiar un filtro antes de re-buscar solo
// (evita disparar una búsqueda por cada dígito al escribir un año).
const AUTO_SEARCH_DELAY = 600;

// Caja de búsqueda con filtros (año desde/hasta), orden y MOTOR de búsqueda.
// El término (query) vive en el padre — así "búsquedas recientes" puede llenarlo.
// Al cambiar cualquier filtro con un tema ya escrito, re-busca automáticamente.
export function SearchBar({ query, onQueryChange, onSearch, disabled, yearRange }) {
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [sort, setSort] = useState("relevance");
  const [engine, setEngine] = useState("openalex");

  // Límites de los campos de año: el rango real si lo conocemos; si no, uno amplio.
  const minYear = yearRange?.from ?? 1500;
  const maxYear = yearRange?.to ?? new Date().getFullYear();

  function buildParams() {
    return {
      query: query.trim(),
      fromYear: fromYear || undefined,
      toYear: toYear || undefined,
      sort,
      engine,
    };
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!query.trim()) return;
    onSearch(buildParams());
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

    const timer = setTimeout(() => onSearch(buildParams()), AUTO_SEARCH_DELAY);
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
            onChange={(event) => setFromYear(event.target.value)}
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
            onChange={(event) => setToYear(event.target.value)}
          />
        </label>

        <label className="search-bar__field">
          Orden
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="search-bar__field">
          Motor
          <select value={engine} onChange={(event) => setEngine(event.target.value)}>
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
