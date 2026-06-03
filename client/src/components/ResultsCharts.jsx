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
//  2) Los papers más citados de la página actual
export function ResultsCharts({ byYear, results }) {
  const topCited = [...results]
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 8)
    .map((paper) => ({ name: shortenTitle(paper.title), citas: paper.citations }));

  if (byYear.length === 0 && topCited.length === 0) return null;

  return (
    <section className="charts">
      {byYear.length > 0 && (
        <div className="charts__panel">
          <h3>📈 Papers por año (tema completo)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byYear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="papers" fill="#2f6df6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {topCited.length > 0 && (
        <div className="charts__panel">
          <h3>🏆 Más citados (de esta página)</h3>
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
