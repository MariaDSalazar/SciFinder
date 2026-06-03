import { useState } from "react";

// Opciones de orden. Centralizadas aquí para no repetir cadenas mágicas.
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "citations", label: "Más citados" },
];

// Caja de búsqueda con filtros (año desde/hasta) y orden.
// El término de búsqueda (query) vive en el padre — así otras piezas, como
// "búsquedas recientes", pueden llenarlo. Los filtros son estado propio.
// "yearRange" (si existe) acota los años a aquellos donde realmente hay papers.
export function SearchBar({ query, onQueryChange, onSearch, disabled, yearRange }) {
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [sort, setSort] = useState("relevance");

  // Límites de los campos de año: el rango real si lo conocemos; si no, uno amplio.
  const minYear = yearRange?.from ?? 1500;
  const maxYear = yearRange?.to ?? new Date().getFullYear();

  function handleSubmit(event) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    onSearch({
      query: term,
      fromYear: fromYear || undefined,
      toYear: toYear || undefined,
      sort,
    });
  }

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

        <button className="search-bar__submit" type="submit" disabled={disabled}>
          {disabled ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {yearRange && (
        <p className="search-bar__hint">
          📅 Hay papers sobre este tema desde <strong>{yearRange.from}</strong> hasta{" "}
          <strong>{yearRange.to}</strong>.
        </p>
      )}
    </form>
  );
}
