/**
 * --------------------------------------------------------------------------
 * Importar módulos y componentes necesarios.
 * --------------------------------------------------------------------------
 *
 * - `NextAuthConfig` de "next-auth": Para definir la configuración de NextAuth.
 */
import type { NextAuthConfig } from 'next-auth';
import '@/types/next-auth';

/**
 * --------------------------------------------------------------------------
 * Objeto `authConfig`.
 * --------------------------------------------------------------------------
 *
 * Este objeto contiene la configuración para NextAuth. Define las páginas
 * de autenticación, los callbacks y los proveedores.
 *
 * @property {object} pages - Las páginas para la autenticación.
 * @property {string} pages.signIn - La página de inicio de sesión.
 * @property {object} callbacks - Los callbacks para la autenticación.
 * @property {function} callbacks.jwt - El callback para JWT.
 * @property {function} callbacks.session - El callback para la sesión.
 * @property {function} callbacks.authorized - El callback de autorización.
 * @property {array} providers - Los proveedores de autenticación.
 */
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    /**
     * Callback de JWT.
     *
     * Este callback se ejecuta cuando se crea un JWT. Añade la información
     * del usuario al token.
     *
     * @param {object} { token, user } - Los objetos de token y usuario.
     * @returns {object} El token actualizado.
     */
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.id_usuario = (user as any).id_usuario;
        token.email = user.email;
        token.tipo = (user as any).tipo;
        token.email_verificado = (user as any).email_verificado;
      }
      return token;
    },
    /**
     * Callback de sesión.
     *
     * Este callback se ejecuta cuando se crea una sesión. Añade la
     * información del usuario a la sesión.
     *
     * @param {object} { session, token } - Los objetos de sesión y token.
     * @returns {object} La sesión actualizada.
     */
    session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).id_usuario = token.id_usuario;
        (session.user as any).tipo = token.tipo;
        (session.user as any).email_verificado = token.email_verificado;
      }
      return session;
    },
    /**
     * Callback de autorización.
     *
     * Este callback se ejecuta para autorizar a un usuario. Comprueba si el
     * usuario está autenticado y tiene el rol necesario para acceder a una página.
     *
     * @param {object} { auth, request: { nextUrl } } - Los objetos de autenticación y solicitud.
     * @returns {boolean|Response} `true` si el usuario está autorizado, `false`
     * para redirigir a la página de login, o un objeto `Response` para redirigir a
     * una página diferente.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = (auth?.user as any)?.tipo;

      // Rutas protegidas por autenticación
      const protectedRoutes = ['/dashboard'];
      const isOnProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      // Rutas solo para administradores
      const adminRoutes = ['/dashboard'];
      const isOnAdminRoute = adminRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      // Rutas solo para clientes
      const clientRoutes = ['/dashboard'];
      const isOnClientRoute = clientRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      // Si el usuario no está autenticado
      if (!isLoggedIn) {
        if (isOnProtectedRoute) {
          return false; // Redirigir a login
        }
        return true;
      }

      // Si es una ruta de administrador
      if (isOnAdminRoute) {
        if (userRole === 'admin') {
          return true;
        }
        return false; // Denegar acceso a no-administradores
      }

      // Si es una ruta de cliente
      if (isOnClientRoute) {
        if (userRole === 'cliente') {
          return true;
        }
        return false; // Denegar acceso a administradores o usuarios sin rol
      }

      // Si está logueado y va a /Auth, redirigir al dashboard
      if (isLoggedIn && nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      // Rutas públicas
      if (isOnProtectedRoute && isLoggedIn) {
        return true;
      }

      return true;
    },
  },
  // El proveedor se define en Auth.ts y se inyecta en NextAuth, así que aquí no es necesario duplicarlo
  providers: [],
} satisfies NextAuthConfig;