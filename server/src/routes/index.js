import { Router } from "express";
import searchRoutes from "./search.routes.js";
import papersRoutes from "./papers.routes.js";
import translateRoutes from "./translate.routes.js";
import favoritesRoutes from "./favorites.routes.js";
import historyRoutes from "./history.routes.js";

// Enrutador raíz de la API. Aquí se montan todos los grupos de rutas.
// Todo cuelga de "/api" (ver app.js).
const router = Router();

// Salud del servicio: útil para comprobar que el backend está vivo.
router.get("/health", (req, res) => {
  res.json({ ok: true, message: "SciFinder backend funcionando 🚀" });
});

router.use(searchRoutes);
router.use(papersRoutes);
router.use(translateRoutes);
router.use(favoritesRoutes);
router.use(historyRoutes);

export default router;
