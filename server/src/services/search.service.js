import * as openAlex from "./openalex.service.js";
import { searchPapersS2 } from "./semanticscholar.service.js";

// Orquestador de motores de búsqueda. Según "engine":
//   "openalex"        → solo OpenAlex
//   "semanticscholar" → solo Semantic Scholar
//   "all"             → ambos en paralelo, combinados sin duplicados (por DOI)
// Las estadísticas por año (gráfica/rango) siempre salen de la agregación de
// OpenAlex: describen el TEMA completo, sea cual sea el motor elegido.
export async function searchPapers(params) {
  if (params.engine === "semanticscholar") {
    const [s2, yearStats] = await Promise.all([
      searchPapersS2(params),
      openAlex.getYearStats(params.query).catch(() => null),
    ]);

    return {
      results: s2.results,
      total: s2.total,
      totals: { semanticScholar: s2.total },
      page: params.page,
      perPage: params.perPage,
      yearRange: yearStats ? { from: yearStats.from, to: yearStats.to } : null,
      byYear: yearStats?.byYear ?? [],
    };
  }

  if (params.engine === "all") {
    // Si Semantic Scholar falla (suele saturarse sin API key), los resultados
    // de OpenAlex salen igual: un motor caído no tumba la búsqueda combinada.
    const [oa, s2] = await Promise.all([
      openAlex.searchPapers(params),
      searchPapersS2(params).catch(() => null),
    ]);

    return {
      ...oa,
      results: mergeByDoi(oa.results, s2?.results ?? [], params.sort),
      total: oa.total + (s2?.total ?? 0),
      totals: { openAlex: oa.total, semanticScholar: s2?.total ?? null },
    };
  }

  const oa = await openAlex.searchPapers(params);
  return { ...oa, totals: { openAlex: oa.total } };
}

// Une dos listas de papers evitando duplicados (mismo DOI = mismo paper).
// Con orden por citas, la lista combinada se reordena completa.
function mergeByDoi(primary, secondary, sort) {
  const seenDois = new Set(
    primary.map((paper) => paper.doi?.toLowerCase()).filter(Boolean),
  );

  const merged = [...primary];
  for (const paper of secondary) {
    const doi = paper.doi?.toLowerCase();
    if (doi && seenDois.has(doi)) continue;
    merged.push(paper);
  }

  if (sort === "citations") {
    merged.sort((a, b) => b.citations - a.citations);
  }
  return merged;
}
