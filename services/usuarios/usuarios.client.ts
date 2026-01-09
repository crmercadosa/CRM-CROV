/**
 * --------------------------------------------------------------------------
 * Servicio Cliente de Usuarios
 * --------------------------------------------------------------------------
 *
 * Este servicio proporciona métodos cliente para interactuar con las APIs
 * de gestión de usuarios. Centraliza todas las llamadas HTTP.
 *
 * Funciones:
 * - Obtener listado de usuarios con filtros
 * - Obtener estadísticas de usuarios
 * - Obtener tipos de rol disponibles
 * - Actualizar rol de un usuario
 */

import type { UsuarioConSucursal, FiltrosUsuarios } from '@/services/usuarios/usuario.service'

interface UsuariosResponse {
  success: boolean
  usuarios: UsuarioConSucursal[]
  total: number
}

interface EstadisticasResponse {
  success: boolean
  total: number
  sinSucursal: number
  activos: number
  inactivos: number
  porRol: Array<{ tipo: string | null; _count: number }>
}

interface RolesResponse {
  success: boolean
  roles: string[]
}

interface ActualizarRolResponse {
  success: boolean
  usuario: UsuarioConSucursal
}

/**
 * --------------------------------------------------------------------------
 * Cargar usuarios con filtros opcionales
 * --------------------------------------------------------------------------
 */
export async function cargarUsuarios(
  filtros?: Partial<FiltrosUsuarios>
): Promise<UsuariosResponse> {
  const params = new URLSearchParams()

  if (filtros?.sinSucursal) {
    params.append('sinSucursal', 'true')
  }
  if (filtros?.rol && filtros.rol !== 'todos') {
    params.append('rol', filtros.rol)
  }
  if (filtros?.estado && filtros.estado !== 'todos') {
    params.append('estado', filtros.estado)
  }
  if (filtros?.busqueda) {
    params.append('busqueda', filtros.busqueda)
  }

  const queryString = params.toString()
  const url = queryString ? `/api/usuarios?${queryString}` : '/api/usuarios'

  const response = await fetch(url)

  if (!response.ok) {
    console.error('Error cargando usuarios:', response.status)
    throw new Error('Error al cargar usuarios')
  }

  const data = await response.json()
  return data
}

/**
 * --------------------------------------------------------------------------
 * Cargar estadísticas de usuarios
 * --------------------------------------------------------------------------
 */
export async function cargarEstadisticas(): Promise<EstadisticasResponse> {
  const response = await fetch('/api/usuarios/estadisticas')

  if (!response.ok) {
    console.error('Error cargando estadísticas:', response.status)
    throw new Error('Error al cargar estadísticas')
  }

  const data = await response.json()
  return data
}

/**
 * --------------------------------------------------------------------------
 * Cargar tipos de rol disponibles
 * --------------------------------------------------------------------------
 */
export async function cargarRoles(): Promise<RolesResponse> {
  const response = await fetch('/api/usuarios/roles')

  if (!response.ok) {
    console.error('Error cargando roles:', response.status)
    throw new Error('Error al cargar roles')
  }

  const data = await response.json()
  return data
}

/**
 * --------------------------------------------------------------------------
 * Actualizar rol de un usuario
 * --------------------------------------------------------------------------
 */
export async function actualizarRolUsuario(
  id: string,
  nuevoRol: 'cliente' | 'admin'
): Promise<ActualizarRolResponse> {
  const response = await fetch('/api/usuarios', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      tipo: nuevoRol,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(errorData.message || `Error del servidor: ${response.status}`)
  }

  const data = await response.json()
  return data
}
