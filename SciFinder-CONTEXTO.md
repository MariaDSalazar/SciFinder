# 🔬 SciFinder — Buscador de Papers Científicos

> Documento de contexto del proyecto. Define **qué** vamos a construir, **por qué**, **con qué** y **cómo**. Es la fuente de verdad: si hay dudas, se consulta aquí.

**Fecha de inicio:** 3 de junio de 2026
**Autora:** Maria del Carmen Salazar Torres
**Estado:** 🟡 Planeación (aún no se escribe código)
**Arquitectura:** Full-stack (Frontend React + Backend Node.js/Express + Base de datos)

---

## 1. 🎯 Objetivo del proyecto

Construir una aplicación web donde el usuario escriba un tema de investigación y obtenga una lista de **papers científicos reales**: título, autores, año, número de citas, revista y enlace al PDF/DOI cuando esté disponible.

### ¿Por qué este proyecto?
- **Meta personal:** fortalecer habilidades de programación y construir un portafolio para **conseguir empleo**.
- **Nivel actual:** principiante → el proyecto debe enseñar mientras se construye.
- **Intereses:** investigación, datos científicos, ciencia.
- **Valor para reclutadores:** demuestra un proyecto **full-stack completo** — consumo y orquestación de múltiples APIs reales, un backend propio (Express), base de datos, manejo de datos, diseño de UI, lógica de estado y visualización.

---

## 2. 🏗️ Arquitectura (visión general)

A diferencia de un proyecto solo-frontend, aquí el navegador **NO** llama directo a las APIs científicas. Habla con **nuestro propio backend**, y el backend habla con las APIs externas.

```
  [ Navegador / React ]
          │  (pide datos a NUESTRA API)
          ▼
  [ Backend Node.js + Express ]  ◀── guarda/lee ──▶  [ Base de datos (PostgreSQL) ]
          │  (consulta y combina APIs externas)
          ▼
  OpenAlex · Semantic Scholar · OpenCitations · (CORE) · (DBLP)
```

### ¿Por qué tener backend? (resuelve 3 problemas reales)
1. **CORS:** muchas APIs bloquean las llamadas hechas desde el navegador. El backend no tiene esa restricción → podemos usar más fuentes.
2. **API keys seguras:** las keys (CORE, etc.) se guardan en el servidor y **nunca** quedan expuestas en el código del navegador.
3. **Combinar y limpiar datos:** el backend une los resultados de varias APIs, los normaliza (todos hablan por **DOI**) y le entrega al frontend una respuesta única y ordenada. También permite **caché** (no repetir llamadas) e **historial/favoritos** en base de datos.

---

## 3. 📡 Fuentes de datos (APIs)

### ⚠️ Aclaración importante: Scopus y Web of Science NO son gratis
Sus APIs requieren **licencia institucional de pago**, así que no se pueden usar en un portafolio público.

### Estrategia: una fuente principal + enriquecimiento
OpenAlex es la base. Las demás APIs **enriquecen** cada paper (resúmenes con IA, red de citas, PDFs). Todas se conectan por el **DOI**, que actúa como "llave común" entre ellas. Gracias al backend, ya no nos limita el CORS ni el manejo de keys.

| API | ¿Gratis? | ¿Key? | Rol en el proyecto | Fase |
|---|---|---|---|---|
| **OpenAlex** | ✅ Sí | ❌ No | 🟢 **Fuente principal**: búsqueda, filtros, metadatos, citas, autores, OA | 1-2 |
| **Semantic Scholar** | ✅ Sí | ⚠️ Opcional (gratis) | 🟢 **Enriquecimiento IA**: TLDR (resumen auto), *citas influyentes*, campos | 3 |
| **OpenCitations** | ✅ Sí (CC0) | ❌ No | 🟢 **Grafo de citas**: "cita a / es citado por" → papers relacionados | 5 |
| **CORE** | ✅ Sí | ✅ Sí (Bearer) | 🟡 **PDFs / texto completo** OA (ahora viable gracias al backend) | 7 |
| **DBLP** | ✅ Sí (CC0) | ❌ No | 🟡 **Opcional**: solo Ciencias de la Computación | Futuro |
| **Lens.org** | ❌ **De pago** | ✅ Token | 🔴 **Descartada** (no encaja en portafolio público gratuito) | — |

#### Detalle de cada una
- **OpenAlex** — `https://api.openalex.org/works`. ~250M de trabajos, sin registro. *(Nota: NO usamos el parámetro `mailto`.)* Sus abstracts vienen "invertidos" → el backend los reconstruye antes de enviarlos al frontend. Docs: https://docs.openalex.org/api-entities/works
- **Semantic Scholar** — Academic Graph API. Funciona sin key (límite compartido) o con key gratis (cupo propio, ~1 req/s). Aporta **TLDR** (resumen generado por IA) y **highly influential citations** (calidad, no solo cantidad). Docs: https://api.semanticscholar.org/api-docs/
- **OpenCitations** — datos CC0, sin key, 180 req/min por IP, +2.2 mil millones de citas. Trabaja por DOI. Permite construir la **red de citaciones**. Docs: https://api.opencitations.net/
- **CORE** — +40M textos completos OA. Requiere **API key** (se guarda en el backend, jamás en el frontend). Límite gratis: 1 batch o 5 peticiones / 10 s. Docs: https://core.ac.uk/documentation/api
- **DBLP** — CC0, sin key, pero **solo computación**. Útil solo si el proyecto se enfoca en CS. Docs: https://dblp.org/faq/How+to+use+the+dblp+search+API.html
- **Lens.org** — de pago (solo prueba de 14 días, uso no comercial). Descartada.

---

## 4. 🛠️ Tecnologías (Stack)

### Frontend
| Capa | Herramienta | Por qué |
|---|---|---|
| Framework UI | **React** | La librería más pedida en empleos. |
| Build tool | **Vite** | Arranque rápido y moderno, estándar actual para React. |
| Lenguaje | **JavaScript** (JSX) | Base sólida antes de saltar a TypeScript. |
| Estilos | **CSS** (por definir: CSS plano o Tailwind) | Empezar simple; decidir al maquetar. |
| Gráficas | **Recharts** (por confirmar) | Librería de gráficas amigable para React. |
| Llamadas HTTP | **fetch** nativo | El frontend solo llama a NUESTRO backend. |
| Favoritos | **Base de datos** (vía backend) | Persisten en el servidor, no solo en un navegador. |

### Backend
| Capa | Herramienta | Por qué |
|---|---|---|
| Runtime | **Node.js** | Mismo lenguaje que el frontend (JavaScript) → menos cosas nuevas. |
| Framework | **Express** | El framework de backend más común y sencillo para empezar. |
| Llamadas a APIs | **fetch** nativo (Node 18+) | Sin librerías extra al inicio. |
| Base de datos | **PostgreSQL** | BD relacional profesional, muy bien vista en portafolio. |
| Acceso a BD (ORM) | **Prisma** | Escribes consultas en JavaScript, no SQL crudo. Amigable para principiantes. |
| Secretos | **variables de entorno** (`.env`) | Guardar API keys fuera del código (y fuera de Git). |

> Para **desarrollo local** se puede usar **SQLite** con el mismo Prisma (sin instalar servidor), y cambiar a PostgreSQL al desplegar. Prisma hace ese cambio muy fácil.

---

## 5. ✨ Funcionalidades

### 5.1 Búsqueda + filtros (frontend → backend → OpenAlex)
- Caja de búsqueda por tema/palabra clave.
- Filtrar por **año** (rango o desde/hasta).
- Ordenar por **número de citas** o **relevancia**.
- (Posible) filtrar por acceso abierto (solo papers con PDF gratis).

### 5.2 Detalle del paper (enriquecido)
- Vista ampliada con: abstract, autores, revista/fuente, año, citas y **enlace al PDF/DOI**.
- **Enriquecimiento:** TLDR (Semantic Scholar) y, cuando exista, PDF de acceso abierto (CORE).
- **Citas bibliográficas en varios formatos:** APA 7, MLA 9, Chicago y BibTeX, con botón de copiar.
- **Traducción del resumen:** el TLDR y el abstract se pueden ver en Original / Español / English (endpoint propio `POST /api/translate`, con caché en el cliente para no repetir llamadas).

### 5.2.1 Rango de años inteligente
- Al buscar, el backend consulta a OpenAlex desde/hasta qué año hay papers del tema (`group_by=publication_year`), filtrando años atípicos (datos mal fechados o futuros).
- El frontend acota los campos de año a ese rango y muestra la pista "hay papers desde X hasta Y".

### 5.3 Favoritos (en base de datos)
- Botón para marcar un paper como favorito.
- Los favoritos se guardan en la **base de datos** vía el backend (persisten de verdad, no atados a un navegador).
- Sección/pestaña para ver la lista de guardados.

### 5.4 Historial de búsquedas (en base de datos)
- El backend guarda las búsquedas realizadas → permite "búsquedas recientes" y estadísticas de uso.

### 5.5 Gráficas y estadísticas
- Papers por año (barras/línea), autores o revistas más frecuentes, distribución de citas.
- **Red de citas** (OpenCitations): "papers que citan / son citados" por el seleccionado.

### 5.6 Caché (en el backend)
- El backend guarda respuestas recientes para no repetir llamadas a las APIs externas → más rápido y respeta los límites de uso.

---

## 6. 🗺️ Plan de construcción (por fases)

> Se construye de lo simple a lo complejo. Cada fase deja algo funcionando. El orden alterna frontend y backend para ver progreso pronto.

- [x] **Fase 0 — Preparación:** ✅ Node.js v24 verificado; frontend creado con Vite (React) en `client/`; backend Express en `server/` con endpoint de salud `/api/health`; Git inicializado y subido a GitHub (privado). Estructura `client/` + `server/` lista.
- [x] **Fase 1 — Backend mínimo + API:** ✅ Arquitectura por capas (routes → controller → service → mapper, con `lib/` y middleware). Endpoint `GET /api/search?q=&page=&perPage=&sort=` que consulta OpenAlex, reconstruye el abstract y devuelve papers limpios. Incluye validación (400), 404 y manejo central de errores. Probado contra OpenAlex real.
- [x] **Fase 2 — Frontend conectado:** ✅ React consume `/api/search` vía capa `services/` + hook `usePaperSearch`. Componentes reutilizables (`SearchBar`, `PaperCard`, `PaperList`, `StatusMessage`). Filtro por año (desde/hasta) y orden por citas/relevancia. Estados de carga/error/vacío. Diseño limpio y responsive.
- [x] **Fase 3 — Detalle + enriquecimiento:** ✅ Endpoint `GET /api/papers/:id` que combina OpenAlex (datos base) + Semantic Scholar (TLDR IA + citas influyentes, por DOI, tolerante a fallos). Modal de detalle en React con abstract completo, autores, stats y enlaces PDF/DOI. Hook genérico `useRequest` reutilizado por búsqueda y detalle.
- [x] **Fase 4 — Base de datos + Favoritos:** ✅ Prisma 6 + SQLite en desarrollo (PostgreSQL al desplegar: solo cambia el provider y la URL). Modelos `FavoritePaper` y `SearchHistory`. Endpoints `GET/POST/DELETE /api/favorites` y `GET /api/history`. Frontend: estrella ⭐ en tarjetas, pestaña Favoritos (reusa PaperList), búsquedas recientes como chips. Historial registrado en cada búsqueda sin frenarla.
- [x] **Fase 5 — Citas y gráficas:** ✅ OpenCitations integrado (citas abiertas + referencias en el detalle, por DOI, tolerante a fallos). Gráficas Recharts: papers por año del tema completo y más citados de la página. Favoritos agrupados por **tema de búsqueda** (columna `topic`). Transparencia de fuentes: cada PDF muestra su repositorio y el detalle indica qué API respondió (OpenAlex/Semantic Scholar/OpenCitations).
- [ ] **Fase 6 — Caché y robustez:** caché en el backend; manejo de estados de carga/error/vacío en el frontend; que si una API externa falla, las demás sigan funcionando.
- [ ] **Fase 7 — Texto completo (CORE):** integrar CORE en el backend (con API key en `.env`) para ofrecer PDFs/texto completo de acceso abierto.
- [ ] **Fase 8 — Pulido:** diseño responsive, mensajes claros, mejoras de UX.
- [ ] **Fase 9 — Publicación:** subir a GitHub + desplegar (frontend en Vercel/Netlify, backend + BD en Render/Railway/Fly.io). README con capturas para el portafolio.

---

## 7. 📁 Estructura de carpetas (propuesta inicial)

Repositorio con dos partes: cliente y servidor.

```
scifinder/
├── client/                  # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/      # Piezas de UI (SearchBar, PaperCard, etc.)
│   │   ├── services/        # Llamadas a NUESTRO backend
│   │   ├── hooks/           # Lógica reutilizable de React
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/                  # Backend (Node.js + Express) — arquitectura por capas
│   ├── src/
│   │   ├── config/          # Configuración central (env.js)
│   │   ├── routes/          # Define las URLs de la API (qué endpoints existen)
│   │   ├── controllers/     # Validan la entrada y arman la respuesta
│   │   ├── services/        # Lógica de negocio: llaman a OpenAlex, S2, etc.
│   │   ├── mappers/         # Convierten datos crudos externos → forma limpia
│   │   ├── middleware/      # notFound (404) y errorHandler central
│   │   ├── lib/             # Utilidades reutilizables (fetchJson, ApiError, abstract)
│   │   ├── app.js           # Construye/configura Express (sin escuchar)
│   │   └── index.js         # Arranque del servidor
│   ├── prisma/
│   │   └── schema.prisma    # Modelo de datos (favoritos, historial)
│   ├── .env                 # API keys y conexión a BD (NUNCA se sube a Git)
│   ├── .env.example         # Plantilla de variables (sí se sube)
│   └── package.json
│
├── .gitignore               # ignora node_modules, .env, etc.
└── README.md
```

---

## 8. 📚 Conceptos que voy a aprender

### Frontend
- **Componentes** de React y cómo se comunican (props).
- **Estado** con `useState` y efectos con `useEffect`.
- Renderizar listas, manejar formularios y estados de **carga / error / vacío**.
- Consumir una API con `fetch` y `async/await`.
- Visualización de datos con gráficas.

### Backend (nuevo)
- Crear un **servidor con Express** y definir **endpoints REST** propios.
- **Orquestar varias APIs externas** y **normalizar/combinar** sus datos (por DOI).
- Guardar **secretos** con variables de entorno (`.env`) — y por qué nunca van a Git.
- **Base de datos** con PostgreSQL + Prisma: modelar tablas, crear/leer/borrar registros.
- **Caché** básica y manejo de errores de servicios externos.

### General
- Flujo de trabajo con **Git** (monorepo cliente/servidor).
- **Despliegue** de frontend, backend y base de datos por separado.

---

## 9. 🔗 Enlaces útiles

- OpenAlex API docs: https://docs.openalex.org/ · Works: https://docs.openalex.org/api-entities/works
- Semantic Scholar API: https://api.semanticscholar.org/api-docs/
- OpenCitations API: https://api.opencitations.net/
- CORE API docs: https://core.ac.uk/documentation/api
- DBLP search API: https://dblp.org/faq/How+to+use+the+dblp+search+API.html
- React docs: https://react.dev/ · Vite: https://vitejs.dev/
- Express: https://expressjs.com/ · Prisma: https://www.prisma.io/docs · PostgreSQL: https://www.postgresql.org/docs/
- Ejemplo de llamada a OpenAlex (probar en el navegador):
  `https://api.openalex.org/works?search=machine%20learning`

---

## 10. 🔐 Git y GitHub (importante para no filtrar secretos)

SciFinder es un **repositorio Git independiente** (su propio `.git` dentro de la carpeta del proyecto). **No** forma parte del repo de `D:\Cursos` — así, a GitHub solo sube SciFinder y nada más (ni cursos, ni certificados, ni el portafolio).

### Qué NUNCA se sube (lo protege el `.gitignore`)
- `.env` y cualquier `.env.*` → **API keys y conexión a la base de datos**. Si una key se sube a GitHub, queda pública. ⚠️
- `.claude/` → configuración local de Claude Code.
- `node_modules/` → dependencias (se reinstalan con `npm install`).
- `dist/`, `build/`, logs, archivos de BD local (`*.sqlite`/`*.db`) y archivos del sistema.

### Qué SÍ se sube
- El código (`client/` y `server/`), el `.gitignore`, este documento y **`server/.env.example`** (plantilla **sin** valores reales, sirve de guía).

### Regla de oro
> Las keys reales viven solo en tu `.env` local (y en las variables de entorno del servicio donde despliegues). El `.env.example` documenta **qué** variables existen, nunca **sus valores**.

---

## 11. 📝 Decisiones pendientes

- [ ] ¿CSS plano o Tailwind CSS para los estilos?
- [ ] ¿Recharts u otra librería para gráficas?
- [ ] ¿PostgreSQL desde el inicio, o empezar con SQLite (local) y migrar al desplegar? *(Prisma permite ambas.)*
- [ ] Nombre final de la app (¿SciFinder u otro?).
- [ ] ¿Pedir API key de Semantic Scholar desde el inicio, o usar el acceso sin key al principio?
- [ ] ¿En qué servicio desplegar el backend + BD (Render / Railway / Fly.io)?

---

*Última actualización: 3 de junio de 2026 — se agregó arquitectura full-stack (backend Node.js/Express + base de datos) y se ampliaron las fuentes de datos.*
