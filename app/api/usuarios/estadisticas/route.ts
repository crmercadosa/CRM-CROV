/**
 * --------------------------------------------------------------------------
 * Ruta API para obtener estadísticas de usuarios
 * --------------------------------------------------------------------------
 *
 * GET /api/usuarios/estadisticas
 *
 * Retorna:
 * - Total de usuarios
 * - Usuarios sin negocio
 * - Usuarios activos
 * - Usuarios inactivos
 * - Conteo por rol
 */

import { NextResponse } from 'next/server'
import { obtenerEstadisticasUsuarios } from '@/services/usuarios/usuario.service'
import { auth } from '@/services/login/Auth'

export async function GET() {
  try {
    // Validar que el usuario sea admin
    const session = await auth()
    const user = session?.user as any

    console.log('Session en /api/usuarios/estadisticas:', { user: user?.tipo })

    if (!session || user?.tipo !== 'admin') {
      console.log('Acceso denegado: no es admin')
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener estadísticas
    const estadisticas = await obtenerEstadisticasUsuarios()

    console.log('Estadísticas obtenidas:', estadisticas)

    return NextResponse.json({
      success: true,
      ...estadisticas,
    })
  } catch (error) {
    console.error('Error en GET /api/usuarios/estadisticas:', error)
    return NextResponse.json(
      { message: 'Error del servidor' },
      { status: 500 }
    )
  }
}
