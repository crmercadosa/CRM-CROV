import { auth } from '../app/login/Auth';
import { NextRequest, NextResponse } from 'next/server';

export default auth((req: NextRequest & { auth: any }) => {
  const user = req.auth?.user;
  const pathname = req.nextUrl.pathname;

  // Si no está autenticado y trata de acceder a rutas protegidas
  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // Si está autenticado y trata de ir a login
  if (user && pathname === '/Auth') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Autorización por rol - Administrador
  // Solo los administradores pueden acceder a estas rutas
  const adminRoutes = ['/dashboard'];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if (isAdminRoute && user?.tipo !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Autorización por rol - Usuario Normal
  // Los usuarios normales pueden acceder a sucursales, pero no a rutas de admin
  const userRoutes = ['/dashboard/sucursales', '/dashboard/perfil'];
  const isUserRestrictedRoute = userRoutes.some((route) => pathname.startsWith(route));

  // Si es una ruta de usuario y el rol no es admin ni user, rechazar
  // (esto es una protección adicional)
  if (isUserRestrictedRoute && !['admin', 'user'].includes(user?.tipo)) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
