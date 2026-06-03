import { PrismaClient } from "@prisma/client";

// Cliente único de Prisma para toda la app (una sola conexión a la BD).
// Todos los servicios que tocan la base de datos importan este objeto.
export const prisma = new PrismaClient();
