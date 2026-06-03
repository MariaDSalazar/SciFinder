import express from "express";
import cors from "cors";

import apiRoutes from "./routes/index.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Construye y configura la app de Express SIN arrancar el servidor.
// Separar "configurar" de "escuchar" deja la app lista para pruebas y despliegue.
export function createApp() {
  const app = express();

  app.use(cors()); // permite que el frontend (otro puerto) consuma esta API
  app.use(express.json()); // parsea cuerpos JSON (lo usaremos en favoritos)

  app.use("/api", apiRoutes);

  // El orden importa: primero el 404, al final el manejador de errores.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
