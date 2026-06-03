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
};
