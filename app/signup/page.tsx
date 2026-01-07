  'use client'

import { useActionState } from 'react'
import { signup, SignupState } from '.'

export default function SignupPage() {
  const initialState: SignupState = { message: null, errors: {} }
  const [state, action] = useActionState(signup, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-lg shadow-lg border border-border">
        <h2 className="text-3xl font-bold text-center text-foreground">Crear Cuenta</h2>
        
        <form action={action} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">Nombre</label>
            <input 
              id="name" 
              name="name" 
              placeholder="Tu Nombre" 
              className="w-full mt-1 p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition" 
            />
            {state?.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">Correo Electrónico</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="correo@ejemplo.com" 
              className="w-full mt-1 p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition" 
            />
            {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              className="w-full mt-1 p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition" 
            />
            {state?.errors?.password && (
              <div className="text-red-500 text-xs mt-1">
                <p>La contraseña debe cumplir con:</p>
                <ul className="list-disc list-inside pl-2">
                  {state.errors.password.map((error: string) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {state?.message && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              {state.message}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 px-4 text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-semibold transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  )
}