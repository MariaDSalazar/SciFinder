import { Lightbulb, TrendingUp, Trophy } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Gráficas de los resultados:
//  1) Producción por año del TEMA COMPLETO (agregación de OpenAlex, no solo la página)
//     → click en una barra fija ese año como filtro (onYearClick).
//  2) Los papers más citados de la página actual
export function ResultsCharts({ byYear, results, onYearClick }) {
  const yearData = sanitizeByYear(byYear);
  const topCited = [...results]
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 8)
    .map((paper) => ({ name: shortenTitle(paper.title), citas: paper.citations }));

  if (yearData.length === 0 && topCited.length === 0) return null;

  return (
    <section className="charts">
      {yearData.length > 0 && (
        <div className="charts__panel">
          <h3>
            <TrendingUp size={15} aria-hidden="true" /> Papers por año (tema completo)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={yearData}
              style={{ cursor: "pointer" }}
              onClick={(state) => {
                // activeLabel es el valor del eje X (el año) de la barra clickeada.
                if (state?.activeLabel != null) onYearClick(state.activeLabel);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="papers" fill="#2f6df6" />
            </BarChart>
          </ResponsiveContainer>
          <p className="charts__hint">
            <Lightbulb size={13} aria-hidden="true" /> Haz click en una barra para ver solo ese
            año.
          </p>
        </div>
      )}

      {topCited.length > 0 && (
        <div className="charts__panel">
          <h3>
            <Trophy size={15} aria-hidden="true" /> Más citados (de esta página)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topCited} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="citas" fill="#f5a623" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

// Recorta títulos largos para que quepan en el eje de la gráfica.
function shortenTitle(title) {
  return title.length > 32 ? `${title.slice(0, 32)}…` : title;
}

// Las fuentes a veces traen papers mal fechados ("del futuro" o de siglos
// imposibles) y años sin datos: se descartan los años absurdos, se ordena y
// se rellenan los huecos con 0 para que las barras queden contiguas y el eje
// no "salte" años — eso hacía que las barras se vieran inconsistentes.
function sanitizeByYear(byYear) {
  const maxValidYear = new Date().getFullYear() + 1;
  const valid = byYear
    .filter((entry) => entry.year >= 1800 && entry.year <= maxValidYear)
    .sort((a, b) => a.year - b.year);
  if (valid.length === 0) return [];

  const counts = new Map(valid.map((entry) => [entry.year, entry.count]));
  const filled = [];
  for (let year = valid[0].year; year <= valid[valid.length - 1].year; year += 1) {
    filled.push({ year, count: counts.get(year) ?? 0 });
  }
  return filled;
}
