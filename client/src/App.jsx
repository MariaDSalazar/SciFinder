import { useEffect, useState } from "react";
import {
  ChevronDown,
  Heart,
  Lightbulb,
  Microscope,
  Search,
  SearchX,
  Star,
  TriangleAlert,
} from "lucide-react";
import { SearchBar } from "./components/SearchBar.jsx";
import { PaperList } from "./components/PaperList.jsx";
import { PaperDetail } from "./components/PaperDetail.jsx";
import { StatusMessage } from "./components/StatusMessage.jsx";
import { LoadingMessage } from "./components/LoadingMessage.jsx";
import { pingHealth } from "./services/papersApi.js";
import { RecentSearches } from "./components/RecentSearches.jsx";
import { FavoritesView } from "./components/FavoritesView.jsx";
import { ResultsCharts } from "./components/ResultsCharts.jsx";
import { usePaperSearch } from "./hooks/usePaperSearch.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { useEnglishSuggestion } from "./hooks/useEnglishSuggestion.js";
import "./App.css";

// Componente principal: compone la página y decide QUÉ mostrar según el estado.
// La lógica de búsqueda y favoritos vive en hooks; aquí solo coordinamos la vista.
export default function App() {
  const {
    results,
    total,
    totals,
    yearRange,
    byYear,
    status,
    error,
    searchedQuery,
    loadingMore,
    hasMore,
    search,
    loadMore,
  } = usePaperSearch();
  const favoritesState = useFavorites();
  // Estado de búsqueda y filtros: el App es la única fuente de verdad, así
  // cualquier camino (botón, recientes, gráfica, sugerencia) respeta los filtros.
  const [query, setQuery] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [sort, setSort] = useState("relevance");
  const [engine, setEngine] = useState("openalex");
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [view, setView] = useState("search");

  // Sugerencia del término en inglés (las APIs indexan mayormente en inglés).
  const englishSuggestion = useEnglishSuggestion(searchedQuery, status);

  // Calentamiento: al abrir la app se hace un ping al backend para que el
  // servidor gratuito despierte mientras el usuario escribe su búsqueda.
  useEffect(() => {
    pingHealth().catch(() => {});
  }, []);

  // Lanza una búsqueda con los filtros actuales (opcionalmente con otro término).
  function runSearch(term = query) {
    const trimmed = term.trim();
    if (!trimmed) return;
    search({
      query: trimmed,
      fromYear: fromYear || undefined,
      toYear: toYear || undefined,
      sort,
      engine,
    });
  }

  // Click en una búsqueda reciente o en la sugerencia en inglés:
  // llena el campo y busca de inmediato respetando los filtros.
  function handlePickQuery(pickedQuery) {
    setQuery(pickedQuery);
    runSearch(pickedQuery);
  }

  // Al guardar desde los resultados, el favorito se etiqueta con el tema buscado.
  function handleToggleFavorite(paper) {
    favoritesState.toggleFavorite(paper, query.trim());
  }

  // Click en una barra de la gráfica: fija ese año en Desde/Hasta.
  // La re-búsqueda automática del SearchBar hace el resto.
  function handleYearClick(year) {
    setFromYear(String(year));
    setToYear(String(year));
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">
          <Microscope className="app__title-icon" size={34} aria-hidden="true" /> SciFinder
        </h1>
        <p className="app__subtitle">Busca papers científicos reales</p>
      </header>

      <nav className="app__tabs">
        <button
          type="button"
          className={view === "search" ? "app__tab app__tab--active" : "app__tab"}
          onClick={() => setView("search")}
        >
          <Search size={15} aria-hidden="true" /> Buscar
        </button>
        <button
          type="button"
          className={view === "favorites" ? "app__tab app__tab--active" : "app__tab"}
          onClick={() => setView("favorites")}
        >
          <Star size={15} aria-hidden="true" /> Favoritos ({favoritesState.favorites.length})
        </button>
      </nav>

      {view === "search" ? (
        <>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            fromYear={fromYear}
            onFromYearChange={setFromYear}
            toYear={toYear}
            onToYearChange={setToYear}
            sort={sort}
            onSortChange={setSort}
            engine={engine}
            onEngineChange={setEngine}
            onSearch={runSearch}
            disabled={status === "loading"}
            yearRange={yearRange}
          />
          <main className="app__results">
            {status === "idle" && <RecentSearches onPick={handlePickQuery} />}
            {renderResults({
              results,
              total,
              totals,
              byYear,
              status,
              error,
              englishSuggestion,
              onPickSuggestion: handlePickQuery,
              isFavorite: favoritesState.isFavorite,
              onToggleFavorite: handleToggleFavorite,
              onSelectPaper: setSelectedPaperId,
              onYearClick: handleYearClick,
              hasMore,
              loadingMore,
              onLoadMore: loadMore,
            })}
          </main>
        </>
      ) : (
        <main className="app__results">
          <FavoritesView favoritesState={favoritesState} onSelectPaper={setSelectedPaperId} />
        </main>
      )}

      {selectedPaperId && (
        <PaperDetail paperId={selectedPaperId} onClose={() => setSelectedPaperId(null)} />
      )}

      <footer className="app__footer">
        Hecho con <Heart className="app__footer-heart" size={12} fill="currentColor" aria-label="amor" />{" "}
        por Maria del Carmen Salazar Torres · Datos: OpenAlex · Semantic Scholar ·
        Crossref · Europe PMC · ERIC · OpenCitations · CORE
      </footer>
    </div>
  );
}

// Nombres legibles de cada motor para el desglose de totales.
const ENGINE_LABELS = {
  openAlex: "OpenAlex",
  semanticScholar: "Semantic Scholar",
  crossref: "Crossref",
  europePmc: "Europe PMC",
  eric: "ERIC",
};

// " (OpenAlex: 1.200 · Crossref: 800 · Semantic Scholar: sin respuesta)"
// Solo se muestra cuando hay más de un motor (búsqueda combinada).
function formatTotalsBreakdown(totals) {
  if (!totals || Object.keys(totals).length <= 1) return "";
  const parts = Object.entries(totals).map(([key, value]) => {
    const label = ENGINE_LABELS[key] ?? key;
    return value === null ? `${label}: sin respuesta` : `${label}: ${value.toLocaleString("es")}`;
  });
  return ` (${parts.join(" · ")})`;
}

// Elige el contenido según el estado de la búsqueda. Separar esta decisión
// mantiene el JSX del componente principal limpio y fácil de leer.
function renderResults({
  results,
  total,
  totals,
  byYear,
  status,
  error,
  englishSuggestion,
  onPickSuggestion,
  isFavorite,
  onToggleFavorite,
  onSelectPaper,
  onYearClick,
  hasMore,
  loadingMore,
  onLoadMore,
}) {
  if (status === "idle") {
    return (
      <StatusMessage icon={<Search size={44} strokeWidth={1.5} aria-hidden="true" />}>
        Escribe un tema y presiona “Buscar” para empezar.
      </StatusMessage>
    );
  }
  if (status === "loading") {
    return <LoadingMessage>Buscando papers...</LoadingMessage>;
  }
  if (status === "error") {
    return (
      <StatusMessage icon={<TriangleAlert size={44} strokeWidth={1.5} aria-hidden="true" />}>
        {error}
      </StatusMessage>
    );
  }
  if (results.length === 0) {
    return (
      <StatusMessage icon={<SearchX size={44} strokeWidth={1.5} aria-hidden="true" />}>
        No se encontraron resultados. Prueba con otros términos.
      </StatusMessage>
    );
  }

  return (
    <>
      {englishSuggestion && (
        <button
          className="app__suggestion"
          type="button"
          onClick={() => onPickSuggestion(englishSuggestion)}
        >
          <Lightbulb size={15} aria-hidden="true" /> Las fuentes científicas indexan en inglés —
          ¿buscar también{" "}
          <strong>“{englishSuggestion}”</strong>?
        </button>
      )}
      <p className="app__count">
        {total.toLocaleString("es")} resultados encontrados{formatTotalsBreakdown(totals)}
      </p>
      {/* Dos columnas: lista de resultados a la izquierda, gráficas a la derecha. */}
      <div className="results-layout">
        <div className="results-layout__list">
          <PaperList
            papers={results}
            onSelectPaper={onSelectPaper}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
          />
          {hasMore && (
            <button
              className="app__load-more"
              type="button"
              onClick={onLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                "Cargando..."
              ) : (
                <>
                  <ChevronDown size={16} aria-hidden="true" /> Cargar más resultados
                </>
              )}
            </button>
          )}
        </div>
        <aside className="results-layout__charts">
          <ResultsCharts byYear={byYear} results={results} onYearClick={onYearClick} />
        </aside>
      </div>
    </>
  );
}
