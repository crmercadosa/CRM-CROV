/**
 * --------------------------------------------------------------------------
 * Importar módulos y componentes necesarios.
 * --------------------------------------------------------------------------
 *
 * - `PrismaClient` de "../src/generated/prisma/client": Para interactuar con la base de datos.
 * - `PrismaMariaDb` de '@prisma/adapter-mariadb': Para conectarse a una base de datos MariaDB.
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

/**
 * --------------------------------------------------------------------------
 * Solución para BigInt.
 * --------------------------------------------------------------------------
 *
 * Esta es una solución para MariaDB cuando se usan BigInts en el esquema.
 */
// @ts-ignore
BigInt.prototype.toJSON = function () { return this.toString() }

/**
 * --------------------------------------------------------------------------
 * Comprobación de la URL de la base de datos.
 * --------------------------------------------------------------------------
 *
 * Esta comprobación asegura que la variable de entorno `DATABASE_URL` esté definida.
 */
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

/**
 * --------------------------------------------------------------------------
 * Adaptador.
 * --------------------------------------------------------------------------
 *
 * Este es el adaptador para conectarse a la base de datos MariaDB.
 */
const adapter = new PrismaMariaDb(databaseUrl);

/**
 * --------------------------------------------------------------------------
 * Instanciación del cliente de Prisma.
 * --------------------------------------------------------------------------
 *
 * Esta es la instanciación del cliente de Prisma. Utiliza una variable global
 * para evitar crear múltiples instancias del cliente en desarrollo.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma