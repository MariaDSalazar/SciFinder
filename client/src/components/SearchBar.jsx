import { useState } from "react";

// Opciones de orden. Centralizadas aquí para no repetir cadenas mágicas.
const SORT_OPTIONS = [
  { value: "relevance", label: "Relevancia" },
  { value: "citations", label: "Más citados" },
];

// Caja de búsqueda con filtros (año desde/hasta) y orden.
// Es un componente "controlado": guarda su propio estado y, al enviar,
// avisa al padre mediante onSearch(params). No sabe nada de cómo se buscan los datos.
export function SearchBar({ onSearch, disabled }) {
  const [query, setQuery] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [sort, setSort] = useState("relevance");

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
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Término de búsqueda"
      />

      <div className="search-bar__filters">
        <label className="search-bar__field">
          Desde
          <input
            type="number"
            min="1500"
            max="2100"
            placeholder="Año"
            value={fromYear}
            onChange={(event) => setFromYear(event.target.value)}
          />
        </label>

        <label className="search-bar__field">
          Hasta
          <input
            type="number"
            min="1500"
            max="2100"
            placeholder="Año"
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
    </form>
  );
}
