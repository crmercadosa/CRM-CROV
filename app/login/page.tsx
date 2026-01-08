'use client'

import { useState } from 'react'
import LoginForm from '../../components/login/loginForm'
import RegisterForm from '../../components/login/RegisterForm'

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center">
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

      {/* Lado derecho - Login/Register Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {!showRegister ? (
              <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}