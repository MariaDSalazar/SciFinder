import { useState } from "react";
import { SearchBar } from "./components/SearchBar.jsx";
import { PaperList } from "./components/PaperList.jsx";
import { PaperDetail } from "./components/PaperDetail.jsx";
import { StatusMessage } from "./components/StatusMessage.jsx";
import { RecentSearches } from "./components/RecentSearches.jsx";
import { FavoritesView } from "./components/FavoritesView.jsx";
import { usePaperSearch } from "./hooks/usePaperSearch.js";
import { useFavorites } from "./hooks/useFavorites.js";
import "./App.css";

// Componente principal: compone la página y decide QUÉ mostrar según el estado.
// La lógica de búsqueda y favoritos vive en hooks; aquí solo coordinamos la vista.
export default function App() {
  const { results, total, yearRange, status, error, search } = usePaperSearch();
  const favoritesState = useFavorites();
  const [query, setQuery] = useState("");
  const [selectedPaperId, setSelectedPaperId] = useState(null);
  const [view, setView] = useState("search");

  // Click en una búsqueda reciente: llena el campo y busca de inmediato.
  function handlePickRecent(recentQuery) {
    setQuery(recentQuery);
    search({ query: recentQuery });
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🔬 SciFinder</h1>
        <p className="app__subtitle">Busca papers científicos reales</p>
      </header>

      <nav className="app__tabs">
        <button
          type="button"
          className={view === "search" ? "app__tab app__tab--active" : "app__tab"}
          onClick={() => setView("search")}
        >
          🔎 Buscar
        </button>
        <button
          type="button"
          className={view === "favorites" ? "app__tab app__tab--active" : "app__tab"}
          onClick={() => setView("favorites")}
        >
          ⭐ Favoritos ({favoritesState.favorites.length})
        </button>
      </nav>

      {view === "search" ? (
        <>
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSearch={search}
            disabled={status === "loading"}
            yearRange={yearRange}
          />
          <main className="app__results">
            {status === "idle" && <RecentSearches onPick={handlePickRecent} />}
            {renderResults({
              results,
              total,
              status,
              error,
              favoritesState,
              onSelectPaper: setSelectedPaperId,
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
    </div>
  );
}

// Elige el contenido según el estado de la búsqueda. Separar esta decisión
// mantiene el JSX del componente principal limpio y fácil de leer.
function renderResults({ results, total, status, error, favoritesState, onSelectPaper }) {
  if (status === "idle") {
    return <StatusMessage icon="🔎">Escribe un tema y presiona “Buscar” para empezar.</StatusMessage>;
  }
  if (status === "loading") {
    return <StatusMessage icon="⏳">Buscando papers...</StatusMessage>;
  }
  if (status === "error") {
    return <StatusMessage icon="⚠️">{error}</StatusMessage>;
  }
  if (results.length === 0) {
    return <StatusMessage icon="🤷">No se encontraron resultados. Prueba con otros términos.</StatusMessage>;
  }

  return (
    <>
      <p className="app__count">{total.toLocaleString("es")} resultados encontrados</p>
      <PaperList
        papers={results}
        onSelectPaper={onSelectPaper}
        isFavorite={favoritesState.isFavorite}
        onToggleFavorite={favoritesState.toggleFavorite}
      />
    </>
  );
}
