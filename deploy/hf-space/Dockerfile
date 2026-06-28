# Imagen del backend de SciFinder para Hugging Face Spaces (SDK: docker).
# El Space enruta el tráfico al puerto declarado en README.md (app_port: 7860),
# por eso la app escucha en 7860 (config.port lee process.env.PORT).
FROM node:22-slim

LABEL org.opencontainers.image.title="SciFinder API" \
      org.opencontainers.image.source="https://github.com/MariaDSalazar/SciFinder" \
      org.opencontainers.image.description="Backend de SciFinder (Express) para Hugging Face Spaces"

# Prisma necesita OpenSSL en tiempo de build y de ejecución.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# node:22-slim ya incluye el usuario "node" (uid 1000), justo el que usa HF.
# Creamos la carpeta de la app y se la asignamos ANTES de cambiar de usuario,
# para que npm ci tenga permiso de escritura.
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
USER node
ENV HOME=/home/node PATH=/home/node/.local/bin:$PATH
WORKDIR /home/node/app

# Instalar dependencias primero (capa cacheable).
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci

# Generar el cliente de Prisma a partir del esquema.
COPY --chown=node:node prisma ./prisma
RUN npx prisma generate

# Código de la aplicación.
COPY --chown=node:node src ./src

ENV NODE_ENV=production
ENV PORT=7860
EXPOSE 7860

# Al arrancar: aplicar migraciones pendientes en Neon y levantar el servidor.
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
