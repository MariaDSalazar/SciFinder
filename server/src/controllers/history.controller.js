import { requireSessionId } from "../lib/session.js";
import { listRecentSearches } from "../services/history.service.js";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;

// GET /api/history?limit=8 — últimas búsquedas distintas DE ESTA SESIÓN.
export async function handleListHistory(req, res, next) {
  try {
    const sessionId = requireSessionId(req);
    const requested = Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT;
    const limit = Math.min(MAX_LIMIT, Math.max(1, requested));

    res.json(await listRecentSearches(sessionId, limit));
  } catch (error) {
    next(error);
  }
}
