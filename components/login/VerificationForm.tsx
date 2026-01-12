'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface VerificationFormProps {
  email: string
  idUsuario: string
  onSuccess?: () => void
}

export default function VerificationForm({ email, idUsuario, onSuccess }: VerificationFormProps) {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(600) // 10 minutos
  const [canResend, setCanResend] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)

  // Temporizador para el token de verificación
  useEffect(() => {
    if (timeRemaining <= 0) {
      setError('El token de verificación ha expirado. Por favor solicita uno nuevo.')
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Temporizador para reenvío
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCanResend(true)
    }
  }, [resendCountdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario, token }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al verificar el token')
        return
      }

      setSuccess(true)
      
      // Mostrar mensaje de éxito y redirigir
      setTimeout(() => {
        onSuccess?.()
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setError('Error de conexión. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setLoading(true)
    setCanResend(false)

    try {
      const response = await fetch('/api/verification/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idUsuario }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al reenviar el token')
        setCanResend(true)
        return
      }

      setToken('')
      setTimeRemaining(600)
      setResendCountdown(60)
      setError(null)
    } catch (err: any) {
      setError('Error de conexión. Por favor intenta de nuevo.')
      setCanResend(true)
    } finally {
      setLoading(false)
    }
  }

  const handleTokenInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setToken(value)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Verificar Correo</h2>
          <p className="text-muted-foreground">
            Hemos enviado un enlace de verificación a<br />
            <span className="font-semibold text-foreground">{email}</span>
          </p>
        </div>

        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm font-medium">
              ✓ ¡Verificación exitosa! Redirigiendo...
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-foreground mb-2">
              Token de Verificación
            </label>
            <textarea
              id="token"
              value={token}
              onChange={handleTokenInput}
              placeholder="Pega el token aquí"
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background font-mono text-sm"
              disabled={loading || success}
              rows={4}
            />
            <div className="mt-2 flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Token de verificación enviado a tu correo
              </p>
              <p className={`text-xs font-semibold ${timeRemaining < 120 ? 'text-red-600' : 'text-muted-foreground'}`}>
                Expira en: {formatTime(timeRemaining)}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || token.length === 0 || success || timeRemaining <= 0}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">¿No recibiste el token?</p>
          <button
            onClick={handleResend}
            disabled={!canResend || loading}
            className="text-primary font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {resendCountdown > 0 
              ? `Reenviar en ${resendCountdown}s`
              : 'Reenviar token'}
          </button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs leading-relaxed">
            <strong>ℹ️ Información:</strong> El token es válido por 10 minutos. 
            Si no lo recibiste, revisa tu carpeta de spam o solicita uno nuevo.
          </p>
        </div>
      </div>
    </div>
  )
}
