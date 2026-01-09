'use client'

/**
 * --------------------------------------------------------------------------
 * Página de Gestión de Usuarios del Dashboard
 * --------------------------------------------------------------------------
 *
 * Esta página permite a los administradores:
 * - Ver todos los usuarios activos registrados en la plataforma
 * - Aplicar filtros avanzados (sin sucursales, rol, estado)
 * - Buscar usuarios por email o nombre
 * - Ver estadísticas de usuarios
 */

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { UsuarioFilters } from '@/components/AdminUsuarios/usuario-filters'
import { UsuariosTable } from '@/components/AdminUsuarios/usuarios-table'
import { Users, TrendingUp } from 'lucide-react'
import type { UsuarioConSucursal, FiltrosUsuarios } from '@/services/usuarios/usuario.service'
import {
  cargarUsuarios,
  cargarEstadisticas,
  cargarRoles,
  actualizarRolUsuario,
} from '@/services/usuarios/usuarios.client'

interface Estadisticas {
  total: number
  sinSucursal: number
  activos: number
  inactivos: number
  porRol: Array<{ tipo: string | null; _count: number }>
}

export default function UsuariosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any

  // Estados
  const [usuarios, setUsuarios] = useState<UsuarioConSucursal[]>([])
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<UsuarioConSucursal[]>([])
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [rolesDisponibles, setRolesDisponibles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtros, setFiltros] = useState({
    sinSucursal: false,
    rol: 'todos',
    estado: 'todos',
    busqueda: '',
  })

  // Validación de sesión
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated' && user?.tipo !== 'admin') {
      router.push('/dashboard')
    }
  }, [status, user, router])

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (status === 'authenticated' && user?.tipo === 'admin') {
      cargarDatos()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, user?.tipo])

  // Función para cargar datos de usuarios y estadísticas
  const cargarDatos = useCallback(async () => {
    try {
      setIsLoading(true)

      // Cargar datos en paralelo
      const [usuariosData, estadisticasData, rolesData] = await Promise.all([
        cargarUsuarios(filtros),
        cargarEstadisticas(),
        cargarRoles(),
      ])

      setUsuarios(usuariosData.usuarios || [])
      setUsuariosFiltrados(usuariosData.usuarios || [])
      setEstadisticas(estadisticasData)
      setRolesDisponibles(rolesData.roles || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filtros])

  // Aplicar filtros a los usuarios
  useEffect(() => {
    let usuariosTemp = [...usuarios]

    // Filtro: búsqueda
    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase()
      usuariosTemp = usuariosTemp.filter(
        (u) =>
          u.email.toLowerCase().includes(busqueda) ||
          (u.nombre && u.nombre.toLowerCase().includes(busqueda))
      )
    }

    // Filtro: rol
    if (filtros.rol !== 'todos') {
      // Mostrar usuarios con rol específico
      usuariosTemp = usuariosTemp.filter((u) => u.tipo === filtros.rol)
    }

    // Filtro: estado
    if (filtros.estado !== 'todos') {
      usuariosTemp = usuariosTemp.filter((u) => u.estado === filtros.estado)
    }


    setUsuariosFiltrados(usuariosTemp)
  }, [filtros, usuarios])

  const handleFiltrosChange = (nuevosFiltros: any) => {
    setFiltros(nuevosFiltros)
  }

  const handleUpdateRole = async (userId: string, newRole: 'cliente' | 'admin') => {
    // Actualización optimista en la UI para respuesta inmediata
    setUsuarios((prev) =>
      prev.map((u) => (String(u.id) === userId ? { ...u, tipo: newRole } : u))
    )

    try {
      await actualizarRolUsuario(userId, newRole)
    } catch (error: any) {
      console.error('Error actualizando rol:', error)
      alert(`No se pudo actualizar el rol: ${error.message}`)
      // Recargar datos para restaurar estado anterior
      cargarDatos()
    }
  }

  const handleLimpiarFiltros = () => {
    setFiltros({
      sinSucursal: false,
      rol: 'todos',
      estado: 'todos',
      busqueda: '',
    })
  }

  if (status === 'loading' || user?.tipo !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-15 p-5">
      {/* Encabezado */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-700">
          Administra y visualiza todos los usuarios registrados en la plataforma
        </p>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total de usuarios */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total de Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.total}</p>
              </div>
              <Users className="h-12 w-12 text-orange-100" />
            </div>
          </div>

          {/* Usuarios activos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Usuarios Activos</p>
                <p className="text-3xl font-bold text-green-600">{estadisticas.activos}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-green-100" />
            </div>
          </div>

          {/* Usuarios sin sucursal */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Sin Sucursal</p>
                <p className="text-3xl font-bold text-yellow-600">{estadisticas.sinSucursal}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg"></div>
            </div>
          </div>

          {/* Usuarios inactivos */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Usuarios Inactivos</p>
                <p className="text-3xl font-bold text-red-600">{estadisticas.inactivos}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <UsuarioFilters
        filtros={filtros}
        rolesDisponibles={rolesDisponibles}
        onFiltrosChange={handleFiltrosChange}
        onLimpiar={handleLimpiarFiltros}
      />

      {/* Tabla de usuarios */}
      <UsuariosTable 
        usuarios={usuariosFiltrados} 
        isLoading={isLoading} 
        onUpdateRole={handleUpdateRole}
      />
    </div>
  )
}
