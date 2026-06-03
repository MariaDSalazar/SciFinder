// ──────────────────────────────────────────────
//  SciFinder — Servidor backend (Express)
//  Por ahora solo arranca y responde un "ping" de salud.
//  En la Fase 1 le agregaremos el endpoint de búsqueda (OpenAlex).
// ──────────────────────────────────────────────

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Permite que el frontend (Vite, en otro puerto) hable con este backend.
app.use(cors());
// Permite leer JSON en el cuerpo de las peticiones (lo usaremos para favoritos).
app.use(express.json());

// Ruta de salud: sirve para comprobar que el servidor está vivo.
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "SciFinder backend funcionando 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Backend escuchando en http://localhost:${PORT}`);
  console.log(`   Prueba: http://localhost:${PORT}/api/health`);
});
