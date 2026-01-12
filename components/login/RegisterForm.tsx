'use client'

import { useActionState, useState } from 'react'
import { signup, type SignupState } from '../../services/signup'
import VerificationForm from './VerificationForm'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const initialState: SignupState = { message: null, errors: {} }
  const [signupState, signupAction] = useActionState(signup, initialState)
  const [showVerification, setShowVerification] = useState(false)

  // Si el registro fue exitoso y requiere verificación, mostrar formulario de verificación
  if (signupState?.success && signupState?.requiresVerification && signupState?.email && signupState?.idUsuario && !showVerification) {
    return (
      <div className="w-full space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm font-medium">
            ✓ ¡Cuenta creada exitosamente!
          </p>
          <p className="text-green-700 text-sm mt-1">
            Ahora necesitas verificar tu correo electrónico para completar el registro.
          </p>
        </div>
        <VerificationForm 
          email={signupState.email}
          idUsuario={signupState.idUsuario}
          onSuccess={() => setShowVerification(true)}
        />
        <button
          onClick={onSwitchToLogin}
          className="w-full mt-4 py-3 px-4 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition font-semibold"
        >
          Volver al Login
        </button>
      </div>
    )
  }

  return (
    <>
      {/* REGISTER FORM */}
      <h2 className="text-3xl font-bold text-center text-foreground mb-2">Crear Cuenta</h2>
      <p className="text-center text-muted-foreground mb-8">Regístrate para comenzar</p>

      <form action={signupAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Nombre Completo
          </label>
          <input
            id="name"
            name="name"
            placeholder="Tu Nombre"
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background"
          />
          {signupState?.errors?.name && (
            <p className="text-red-500 text-xs mt-1">{signupState.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
            Correo Electrónico
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background"
          />
          {signupState?.errors?.email && (
            <p className="text-red-500 text-xs mt-1">{signupState.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
            Contraseña
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition bg-background"
          />
          {signupState?.errors?.password && (
            <div className="text-red-500 text-xs mt-1">
              <p className="font-semibold">La contraseña debe tener:</p>
              <ul className="list-disc list-inside pl-2">
                {signupState.errors.password.map((error: string) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {signupState?.message && !signupState?.success && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
            {signupState.message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Registrarse
        </button>
      </form>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="w-full mt-4 py-3 px-4 text-primary border-2 border-primary rounded-lg hover:bg-primary/5 transition font-semibold"
      >
        Volver al Login
      </button>
    </>
  )
}
