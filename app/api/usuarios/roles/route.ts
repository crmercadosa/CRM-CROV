/**
 * --------------------------------------------------------------------------
 * Ruta API para obtener tipos de rol disponibles
 * --------------------------------------------------------------------------
 *
 * GET /api/usuarios/roles
 *
 * Retorna:
 * - Array de tipos de rol disponibles en la plataforma
 */

import { NextResponse } from 'next/server'
import { obtenerTiposRol } from '@/services/usuarios/usuario.service'
import { auth } from '@/services/login/Auth'

export async function GET() {
  try {
    // Validar que el usuario sea admin
    const session = await auth()
    const user = session?.user as any

    console.log('Session en /api/usuarios/roles:', { user: user?.tipo })

    if (!session || user?.tipo !== 'admin') {
      console.log('Acceso denegado: no es admin')
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener tipos de rol
    const roles = await obtenerTiposRol()

    console.log('Roles obtenidos:', roles)

    return NextResponse.json({
      success: true,
      roles,
    })
  } catch (error) {
    console.error('Error en GET /api/usuarios/roles:', error)
    return NextResponse.json(
      { message: 'Error del servidor' },
      { status: 500 }
    )
  }
}
