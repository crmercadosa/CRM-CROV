'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
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
    <>
      {/* LOGIN FORM */}
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

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="w-full py-3 px-4 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition font-semibold"
      >
        Crear Cuenta
      </button>

      <p className="text-center text-sm text-muted-foreground mt-6">
        © 2025 CROV AI. Todos los derechos reservados.
      </p>
    </>
  )
}
