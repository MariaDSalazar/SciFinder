# Imagen del backend de SciFinder para Hugging Face Spaces (SDK: docker).
# El Space enruta el tráfico al puerto declarado en README.md (app_port: 7860),
# por eso la app escucha en 7860 (config.port lee process.env.PORT).
FROM node:22-slim

# Prisma necesita OpenSSL en tiempo de build y de ejecución.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Hugging Face ejecuta el contenedor como el usuario uid 1000.
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH
WORKDIR /app

# Instalar dependencias primero (capa cacheable).
COPY --chown=user package.json package-lock.json ./
RUN npm ci

# Generar el cliente de Prisma a partir del esquema.
COPY --chown=user prisma ./prisma
RUN npx prisma generate

# Código de la aplicación.
COPY --chown=user src ./src

ENV NODE_ENV=production
ENV PORT=7860
EXPOSE 7860

# Al arrancar: aplicar migraciones pendientes en Neon y levantar el servidor.
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
