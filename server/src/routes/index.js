import { Router } from "express";
import searchRoutes from "./search.routes.js";
import papersRoutes from "./papers.routes.js";

// Enrutador raíz de la API. Aquí se montan todos los grupos de rutas.
// Todo cuelga de "/api" (ver app.js).
const router = Router();

// Salud del servicio: útil para comprobar que el backend está vivo.
router.get("/health", (req, res) => {
  res.json({ ok: true, message: "SciFinder backend funcionando 🚀" });
});

router.use(searchRoutes);
router.use(papersRoutes);

export default router;
