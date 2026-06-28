---
title: SciFinder API
emoji: 🔬
colorFrom: indigo
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# SciFinder API

Backend (Node.js + Express) de SciFinder: proxy y orquestador de APIs científicas.
Este Space se actualiza automáticamente desde el repositorio de GitHub en cada push a `main`.

Las claves (`DATABASE_URL`, `CORE_API_KEY`, `SEMANTIC_SCHOLAR_API_KEY`) se configuran
como *Secrets* en los ajustes del Space, nunca en el código.
