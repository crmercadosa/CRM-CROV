'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import VerificationForm from '@/components/login/VerificationForm'

export default function VerifyEmailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Si la sesión se carga y el usuario está verificado, redirigir al dashboard
    if (status === 'authenticated' && session?.user?.email_verificado) {
      router.push('/dashboard')
    }
    
    // Si no hay sesión activa, redirigir al login
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Se redirigirá automáticamente al login
  }

  const idUsuario = (session?.user as any)?.id_usuario || (session?.user as any)?.id || ''

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <VerificationForm 
            email={session?.user?.email || ''}
            idUsuario={idUsuario}
            onSuccess={() => router.push('/dashboard')}
          />
        </div>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            ¿Necesitas ayuda?{' '}
            <a href="/support" className="text-primary hover:underline">
              Contacta con soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
