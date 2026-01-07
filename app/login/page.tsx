'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password_hash: password,
        redirect: false,
      })

      console.log('SignIn result:', result)

      if (result?.error) {
        setError('Correo o contraseña inválidos')
        setLoading(false)
        return
      }

      if (result?.ok) {
        console.log('Login successful, redirecting to dashboard')
        router.push('/dashboard')
        return
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Ocurrió un error durante el inicio de sesión')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Lado izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary text-white flex-col items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 text-5xl font-bold">CROV AI</div>
          <h1 className="text-4xl font-bold mb-6">Plataforma para Negocios</h1>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Gestiona tus sucursales y automatiza procesos con inteligencia artificial avanzada.
          </p>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div>
                <p className="font-semibold">Gestión Centralizada</p>
                <p className="text-sm text-primary-foreground/80">Controla todas tus sucursales desde un solo lugar</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div>
                <p className="font-semibold">Automatización IA</p>
                <p className="text-sm text-primary-foreground/80">Automatiza tareas repetitivas con IA</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div>
                <p className="font-semibold">Análisis en Tiempo Real</p>
                <p className="text-sm text-primary-foreground/80">Obtén insights instantáneos de tu negocio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-2">Bienvenido</h2>
            <p className="text-center text-muted-foreground mb-8">Inicia sesión en tu cuenta</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Correo Electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border" />
                  <span className="text-muted-foreground">Recuérdame</span>
                </label>
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">O</span>
              </div>
            </div>

            <p className="text-center text-muted-foreground">
              ¿No tienes cuenta?{' '}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2025 CROV AI. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}