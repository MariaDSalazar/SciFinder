// Caché en memoria con expiración (TTL) y límite de entradas.
// Evita repetir llamadas a las APIs externas: la misma búsqueda, detalle o
// traducción dentro de su ventana de tiempo se sirve al instante y sin gastar
// cupo (importante con Semantic Scholar, que permite ~1 petición/segundo).
// Nota: vive en memoria → al reiniciar el servidor se vacía. Suficiente para
// este proyecto; en sistemas grandes se usaría Redis o similar.

const MAX_ENTRIES = 500;
const store = new Map();

// Duraciones estándar (ms) que usan los controladores.
export const TTL = {
  search: 5 * 60 * 1000, // búsquedas: 5 min (los resultados cambian poco)
  detail: 30 * 60 * 1000, // detalle de un paper: 30 min
  translation: 24 * 60 * 60 * 1000, // traducciones: 24 h (son deterministas)
};

// Devuelve { value, hit }: hit=true si la respuesta salió de la caché
// (sin ejecutar "producer"). Los errores NO se cachean: si producer falla,
// el error sube y no queda nada guardado.
export async function cached(key, ttlMs, producer) {
  const entry = store.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return { value: entry.value, hit: true };
  }

  const value = await producer();
  store.set(key, { value, expiresAt: Date.now() + ttlMs });

  // Límite de memoria: si se rebasa, se elimina la entrada más antigua.
  if (store.size > MAX_ENTRIES) {
    store.delete(store.keys().next().value);
  }

  return { value, hit: false };
}
