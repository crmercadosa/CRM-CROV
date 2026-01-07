/**
 * --------------------------------------------------------------------------
 * Importar módulos y componentes necesarios.
 * --------------------------------------------------------------------------
 * 
 * - `Metadata` de "next": Para definir los metadatos de la página.
 * - `Geist` y `Geist_Mono` de "next/font/google": Para cargar fuentes personalizadas.
 * - `"./globals.css"`: Para importar estilos globales.
 * - `SessionProvider` de "next-auth/react": Para proveer el contexto de la sesión a la aplicación.
 * - `auth` de "@/app/login/Auth": Para recuperar la información de la sesión.
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/app/login/Auth";

/**
 * --------------------------------------------------------------------------
 * Configurar fuentes personalizadas usando Geist.
 * --------------------------------------------------------------------------
 * 
 * - `geistSans`: La fuente principal sans-serif.
 * - `geistMono`: La fuente principal monoespaciada.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * --------------------------------------------------------------------------
 * Definir los metadatos para la página.
 * --------------------------------------------------------------------------
 * 
 * - `title`: El título de la página.
 * - `description`: Una breve descripción de la página.
 */
export const metadata: Metadata = {
  title: "CROV AI - Plataforma para Negocios",
  description: "Gestiona tus sucursales y automatiza procesos con inteligencia artificial avanzada.",
};

/**
 * --------------------------------------------------------------------------
 * Componente RootLayout.
 * --------------------------------------------------------------------------
 * 
 * Este es el layout raíz de la aplicación. Envuelve todas las páginas y
 * provee una estructura consistente.
 * 
 * @param {Readonly<{ children: React.ReactNode }>} { children } - Los componentes hijos a renderizar.
 * @returns {JSX.Element} El componente RootLayout renderizado.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
