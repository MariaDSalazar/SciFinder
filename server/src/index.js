import { createApp } from "./app.js";
import { config } from "./config/env.js";

// Punto de entrada: crea la app y la pone a escuchar.
const app = createApp();

app.listen(config.port, () => {
  console.log(`✅ Backend escuchando en http://localhost:${config.port}`);
  console.log(`   Salud:    http://localhost:${config.port}/api/health`);
  console.log(`   Búsqueda: http://localhost:${config.port}/api/search?q=machine+learning`);
});
