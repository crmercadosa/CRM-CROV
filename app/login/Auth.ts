/**
 * --------------------------------------------------------------------------
 * Importar módulos y componentes necesarios.
 * --------------------------------------------------------------------------
 *
 * - `NextAuth` de "next-auth": Para inicializar NextAuth.
 * - `authConfig` de "./auth.config": Para la configuración de NextAuth.
 * - `Credentials` de "next-auth/providers/credentials": Para crear un proveedor de credenciales.
 * - `prisma` de "../../lib/prisma": Para interactuar con la base de datos.
 * - `z` de "zod": Para validar datos.
 * - `bcrypt` de "bcryptjs": Para comparar contraseñas.
 */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '../../lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

/**
 * --------------------------------------------------------------------------
 * Interfaz `AuthUser`.
 * --------------------------------------------------------------------------
 *
 * Esta interfaz define la estructura del objeto de usuario que se devuelve
 * después de un inicio de sesión exitoso.
 *
 * @property {string} id - El ID del usuario.
 * @property {string} email - El email del usuario.
 * @property {string} [nombre] - El nombre del usuario (opcional).
 * @property {string} [tipo] - El rol del usuario (opcional).
 * @property {string} [id_sucursal] - El ID de la sucursal del usuario (opcional).
 */
interface AuthUser {
  id: string;
  email: string;
  nombre?: string;
  tipo?: string;
  id_sucursal?: string;
}

/**
 * --------------------------------------------------------------------------
 * Función `login`.
 * --------------------------------------------------------------------------
 *
 * Esta función es responsable de iniciar sesión de un usuario. Comprueba si el usuario
 * existe y si la contraseña es correcta.
 *
 * @param {string} email - El email del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<AuthUser | null>} El objeto de usuario si el inicio de sesión es
 * exitoso, o `null` en caso contrario.
 */
async function login(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: {
        sucursal: {
          select: {
            id: true,
            nombre_negocio: true,
          },
        },
      },
    });

    if (!user) {
      console.error('Usuario no encontrado');
      return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password_hash);

    if (passwordsMatch) {
      return {
        id: String(user.id),
        email: user.email,
        nombre: user.nombre || undefined,
        tipo: user.tipo || undefined,
      };
    }

    return null;
  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
}

/**
 * --------------------------------------------------------------------------
 * Configuración de `NextAuth`.
 * --------------------------------------------------------------------------
 *
 * Esta es la configuración principal para NextAuth. Define los proveedores de
 * autenticación y los callbacks.
 *
 * @property {object} ...authConfig - La configuración base para NextAuth.
 * @property {array} providers - Los proveedores de autenticación.
 */
export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      /**
       * Función `authorize`.
       *
       * Esta función se ejecuta cuando un usuario intenta iniciar sesión. Valida
       * las credenciales del usuario y devuelve el objeto de usuario si el inicio de sesión es
       * exitoso.
       *
       * @param {object} credentials - Las credenciales del usuario.
       * @returns {Promise<any>} El objeto de usuario si el inicio de sesión es exitoso,
       * o `null` en caso contrario.
       */
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password_hash: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password_hash } = parsedCredentials.data;
          const user = await login(email, password_hash);

          if (user) {
            return user as any;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});