// Acceso centralizado a la configuración del servidor.
// Un solo lugar lee process.env → el resto del código importa "config".
export const config = {
  port: Number(process.env.PORT) || 3000,
  openAlex: {
    baseUrl: "https://api.openalex.org",
  },
};
