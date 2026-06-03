# 🔬 SciFinder

**Buscador de papers científicos en tiempo real**, construido como aplicación full-stack. Busca cualquier tema de investigación y obtén artículos científicos reales con resúmenes generados por IA, métricas de citas, gráficas de tendencias, citas bibliográficas listas para copiar y guardado de favoritos por tema.

### 🌍 Demo en vivo
**👉 https://mariadsalazar.github.io/SciFinder/**

> ⏳ *Nota: el backend corre en un plan gratuito y "duerme" tras 15 min de inactividad — la primera búsqueda puede tardar ~1 minuto en despertar el servidor. Las siguientes son rápidas.*

---

## ✨ Funcionalidades

- 🔎 **Búsqueda multi-motor**: elige entre OpenAlex, Semantic Scholar, Crossref, Europe PMC, ERIC (educación) — o **todos a la vez**, combinados sin duplicados (deduplicación por DOI).
- 🤖 **Resumen IA (TLDR)** de cada paper, cortesía de Semantic Scholar.
- 🌐 **Traducción del resumen y abstract** a español o inglés con un click.
- 📋 **Citas bibliográficas** en **APA 7, MLA 9, Chicago y BibTeX**, con botón de copiar.
- 📊 **Métricas de calidad**: citas totales, citas influyentes (Semantic Scholar) y citas abiertas + referencias (OpenCitations).
- 📄 **Rescate de PDFs**: si la fuente principal no tiene el PDF, se consulta CORE para encontrar una copia de acceso abierto — cada PDF indica el repositorio que lo aloja (arXiv, PubMed Central, etc.).
- 📈 **Gráficas interactivas** (Recharts): producción de papers por año del tema completo (click en una barra = filtrar ese año) y ranking de más citados.
- ⭐ **Favoritos agrupados por tema de búsqueda**, persistidos en PostgreSQL.
- 🕘 **Historial de búsquedas recientes** con acceso de un click.
- 🎚️ **Filtros inteligentes**: rango de años acotado a los años donde realmente existen papers (descartando datos mal fechados), orden por relevancia o citas, y re-búsqueda automática al cambiar cualquier filtro.
- ⚡ **Caché en el servidor** con TTL: repetir una búsqueda/detalle/traducción responde en ~20 ms sin tocar las APIs externas (cabecera `X-Cache: HIT/MISS`).
- 📱 Diseño responsive, estados de carga/error/vacío, paginación "cargar más" y cierre de modal con `Esc`.

---

## 🏗️ Arquitectura

```
  [ Navegador / React ]
          │  (consume NUESTRA API)
          ▼
  [ Backend Node.js + Express ]  ◀── Prisma ──▶  [ PostgreSQL (Neon) ]
          │  (orquesta, combina y cachea)
          ▼
  OpenAlex · Semantic Scholar · Crossref · Europe PMC · ERIC · OpenCitations · CORE
```

El backend actúa como **orquestador**: resuelve CORS, protege las API keys (nunca llegan al navegador), normaliza los datos heterogéneos de 7 fuentes a un contrato único (usando el **DOI como llave común**), tolera fallos parciales (una fuente caída no tumba la búsqueda combinada) y cachea respuestas.

### Backend — arquitectura por capas

```
server/src/
├── config/        # Configuración centralizada (lectura única de variables de entorno)
├── routes/        # Definición de endpoints
├── controllers/   # Validación de entrada y armado de respuesta
├── services/      # Lógica de negocio: un servicio por fuente externa + orquestador
├── mappers/       # Dato crudo externo → forma limpia interna (contrato estable)
├── middleware/    # 404 y manejador central de errores
└── lib/           # Utilidades reutilizables: cliente HTTP, caché TTL, validación, Prisma
```

---

## 🛠️ Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| **React 19** | Interfaz de usuario por componentes |
| **Vite** | Build tool y servidor de desarrollo |
| **JavaScript (JSX)** | Lenguaje |
| **Recharts** | Gráficas interactivas |
| **CSS** (variables custom) | Estilos y diseño responsive |
| Hooks personalizados | `useRequest` (genérico), `usePaperSearch` (paginación + descarte de respuestas obsoletas), `usePaperDetail`, `useFavorites` |

### Backend
| Tecnología | Uso |
|---|---|
| **Node.js 24 + Express 5** | API REST |
| **PostgreSQL** (Neon) | Persistencia de favoritos e historial |
| **Prisma 6** | ORM y migraciones |
| **fetch nativo** | Llamadas a APIs externas (con timeout, reintentos ante rate-limit y manejo central de errores) |
| Caché en memoria con TTL | Búsquedas (5 min), detalle (30 min), traducciones (24 h) |

### Infraestructura
| Pieza | Servicio |
|---|---|
| Frontend | **GitHub Pages** (deploy automático con GitHub Actions en cada push) |
| Backend | **Render** (web service) |
| Base de datos | **Neon** (PostgreSQL serverless) |

---

## 📡 APIs científicas integradas

| API | Rol en SciFinder | Autenticación |
|---|---|---|
| [OpenAlex](https://docs.openalex.org/) | Motor principal: búsqueda, metadatos, estadísticas por año, detalle | No requiere |
| [Semantic Scholar](https://api.semanticscholar.org/api-docs/) | Motor de búsqueda + TLDR (resumen IA) + citas influyentes | API key gratuita |
| [Crossref](https://www.crossref.org/documentation/retrieve-metadata/rest-api/) | Motor de búsqueda (registro oficial de DOIs) | No requiere |
| [Europe PMC](https://europepmc.org/RestfulWebService) | Motor de búsqueda (biomedicina y ciencias de la vida) | No requiere |
| [ERIC](https://eric.ed.gov/?api) | Motor de búsqueda (educación) | No requiere |
| [OpenCitations](https://opencitations.net/) | Citas abiertas y referencias por DOI | No requiere |
| [CORE](https://core.ac.uk/services/api) | Localización de PDFs de acceso abierto | API key gratuita |

Cada paper indica de qué motor proviene (`vía OpenAlex`, `vía Semantic Scholar`...) y el detalle muestra qué fuentes respondieron — transparencia total de los datos.

---

## 🔌 Endpoints de la API propia

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servicio |
| `GET` | `/api/search?q=&engine=&sort=&fromYear=&toYear=&page=&perPage=` | Búsqueda multi-motor con filtros |
| `GET` | `/api/papers/:id` | Detalle enriquecido (acepta id de OpenAlex `W...` o `doi:10...`) |
| `POST` | `/api/translate` | Traducción de texto (`{ text, to: "es" \| "en" }`) |
| `GET/POST/DELETE` | `/api/favorites` | Favoritos persistidos (etiquetados por tema) |
| `GET` | `/api/history` | Búsquedas recientes |

---

## 🚀 Ejecutar en local

Requisitos: Node.js 22+ y una base PostgreSQL (gratis en [Neon](https://neon.tech)).

```bash
# 1. Clonar
git clone https://github.com/MariaDSalazar/SciFinder.git
cd SciFinder

# 2. Backend
cd server
npm install
# Crear el archivo .env a partir de la plantilla y llenar los valores:
#   - DATABASE_URL (PostgreSQL)
#   - SEMANTIC_SCHOLAR_API_KEY (opcional, recomendada)
#   - CORE_API_KEY (opcional)
cp .env.example .env
npx prisma migrate deploy
npm run dev          # → http://localhost:3000

# 3. Frontend (en otra terminal)
cd client
npm install
npm run dev          # → http://localhost:5173
```

---

## 👩‍💻 Autora

**Maria del Carmen Salazar Torres**

Proyecto de portafolio full-stack: consumo y orquestación de múltiples APIs públicas, diseño de API REST propia, modelado de datos, caché, tolerancia a fallos, CI/CD y despliegue en producción.

## 📄 Licencia

Distribuido bajo la **Licencia MIT** — uso libre y gratuito, conservando el aviso de autoría. Ver [LICENSE](LICENSE).
