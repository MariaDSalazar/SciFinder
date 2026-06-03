// Acceso centralizado a la configuración del servidor.
// Un solo lugar lee process.env → el resto del código importa "config".
export const config = {
  port: Number(process.env.PORT) || 3000,
  openAlex: {
    baseUrl: "https://api.openalex.org",
  },
  semanticScholar: {
    baseUrl: "https://api.semanticscholar.org",
    // Opcional: sin key funciona (cupo compartido); con key hay cupo propio.
    apiKey: process.env.SEMANTIC_SCHOLAR_API_KEY || null,
  },
  translate: {
    baseUrl: "https://translate.googleapis.com",
  },
  openCitations: {
    baseUrl: "https://api.opencitations.net/index/v2",
  },
  crossref: {
    baseUrl: "https://api.crossref.org",
  },
  europePmc: {
    baseUrl: "https://www.ebi.ac.uk/europepmc/webservices/rest",
  },
  eric: {
    baseUrl: "https://api.ies.ed.gov/eric",
  },
  core: {
    baseUrl: "https://api.core.ac.uk/v3",
    // La key vive en el .env del servidor; el navegador jamás la ve.
    apiKey: process.env.CORE_API_KEY || null,
  },
};
