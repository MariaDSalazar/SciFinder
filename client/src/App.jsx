import { useState } from "react";
import { SearchBar } from "./components/SearchBar.jsx";
import { PaperList } from "./components/PaperList.jsx";
import { PaperDetail } from "./components/PaperDetail.jsx";
import { StatusMessage } from "./components/StatusMessage.jsx";
import { usePaperSearch } from "./hooks/usePaperSearch.js";
import "./App.css";

// Componente principal: compone la página y decide QUÉ mostrar según el estado.
// La lógica de búsqueda vive en el hook; aquí solo coordinamos la vista.
export default function App() {
  const { results, total, status, error, search } = usePaperSearch();
  const [selectedPaperId, setSelectedPaperId] = useState(null);

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">🔬 SciFinder</h1>
        <p className="app__subtitle">Busca papers científicos reales</p>
      </header>

      <SearchBar onSearch={search} disabled={status === "loading"} />

      <main className="app__results">
        {renderResults({ results, total, status, error, onSelectPaper: setSelectedPaperId })}
      </main>

      {selectedPaperId && (
        <PaperDetail paperId={selectedPaperId} onClose={() => setSelectedPaperId(null)} />
      )}
    </div>
  );
}

// Elige el contenido según el estado de la búsqueda. Separar esta decisión
// mantiene el JSX del componente principal limpio y fácil de leer.
function renderResults({ results, total, status, error, onSelectPaper }) {
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
      <PaperList papers={results} onSelectPaper={onSelectPaper} />
    </>
  );
}
