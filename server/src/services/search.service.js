import * as openAlex from "./openalex.service.js";
import { searchPapersS2 } from "./semanticscholar.service.js";
import { searchPapersCrossref } from "./crossref.service.js";
import { searchPapersEuropePmc } from "./europepmc.service.js";

// Registro de motores SECUNDARIOS. Agregar un motor nuevo = una entrada aquí
// (más su servicio y mapper). "key" es el nombre que ve el frontend en totals.
const SECONDARY_ENGINES = {
  semanticscholar: { search: searchPapersS2, key: "semanticScholar" },
  crossref: { search: searchPapersCrossref, key: "crossref" },
  europepmc: { search: searchPapersEuropePmc, key: "europePmc" },
};

// Orquestador de motores de búsqueda. Según "engine":
//   "openalex"             → solo OpenAlex (motor principal)
//   nombre de un secundario → solo ese motor
//   "all"                  → todos en paralelo, combinados sin duplicados (por DOI)
// Las estadísticas por año (gráfica/rango) siempre salen de la agregación de
// OpenAlex: describen el TEMA completo, sea cual sea el motor elegido.
export async function searchPapers(params) {
  const secondary = SECONDARY_ENGINES[params.engine];

  if (secondary) {
    const [response, yearStats] = await Promise.all([
      secondary.search(params),
      openAlex.getYearStats(params.query).catch(() => null),
    ]);

    return {
      results: response.results,
      total: response.total,
      totals: { [secondary.key]: response.total },
      page: params.page,
      perPage: params.perPage,
      yearRange: yearStats ? { from: yearStats.from, to: yearStats.to } : null,
      byYear: yearStats?.byYear ?? [],
    };
  }

  if (params.engine === "all") {
    // Todos los motores en paralelo. Un secundario caído (suele pasar con
    // Semantic Scholar sin key) no tumba la búsqueda combinada: queda en null.
    const names = Object.keys(SECONDARY_ENGINES);
    const [oa, ...others] = await Promise.all([
      openAlex.searchPapers(params),
      ...names.map((name) => SECONDARY_ENGINES[name].search(params).catch(() => null)),
    ]);

    let results = oa.results;
    let total = oa.total;
    const totals = { openAlex: oa.total };

    names.forEach((name, index) => {
      const response = others[index];
      totals[SECONDARY_ENGINES[name].key] = response?.total ?? null;
      if (response) {
        results = mergeByDoi(results, response.results);
        total += response.total;
      }
    });

    if (params.sort === "citations") {
      results.sort((a, b) => b.citations - a.citations);
    }

    return { ...oa, results, total, totals };
  }

  const oa = await openAlex.searchPapers(params);
  return { ...oa, totals: { openAlex: oa.total } };
}

// Une dos listas de papers evitando duplicados (mismo DOI = mismo paper).
// Se queda con la versión de la lista primaria (la primera en llegar).
function mergeByDoi(primary, secondary) {
  const seenDois = new Set(
    primary.map((paper) => paper.doi?.toLowerCase()).filter(Boolean),
  );

  const merged = [...primary];
  for (const paper of secondary) {
    const doi = paper.doi?.toLowerCase();
    if (doi && seenDois.has(doi)) continue;
    if (doi) seenDois.add(doi);
    merged.push(paper);
  }
  return merged;
}
