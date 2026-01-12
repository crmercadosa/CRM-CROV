/**
 * --------------------------------------------------------------------------
 * Ruta API para obtener usuarios con filtros y paginación
 * --------------------------------------------------------------------------
 *
 * GET /api/usuarios
 *
 * Parámetros de query:
 * - sinSucursal: boolean - Filtrar usuarios sin negocios
 * - rol: string - Filtrar por tipo de rol
 * - estado: string - Filtrar por estado
 * - busqueda: string - Búsqueda por email o nombre
 * - pagina: number - Número de página (default: 1)
 */

import { NextRequest, NextResponse } from 'next/server'
import { obtenerUsuarios, actualizarRolUsuario, FiltrosUsuarios } from '@/services/usuarios/usuario.service'
import { auth } from '@/services/login/Auth'

// Constante para usuarios por página
const USUARIOS_POR_PAGINA = 10

// Helper para serializar BigInt a string en JSON
const jsonBigInt = (data: any) => {
  return JSON.parse(JSON.stringify(data, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
};

export async function GET(request: NextRequest) {
  try {
    // Validar que el usuario sea admin
    const session = await auth()
    const user = session?.user as any

    console.log('Session en /api/usuarios:', { session, user: user?.tipo })

    if (!session || user?.tipo !== 'admin') {
      console.log('Acceso denegado: no es admin')
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener parámetros de query
    const searchParams = request.nextUrl.searchParams
    const sinSucursal = searchParams.get('sinSucursal') === 'true'
    const rol = searchParams.get('rol') || 'todos'
    const estado = searchParams.get('estado') || 'todos'
    const busqueda = searchParams.get('busqueda') || ''
    const pagina = Math.max(1, parseInt(searchParams.get('pagina') || '1'))

    // Construir objeto de filtros
    const filtros: FiltrosUsuarios = {
      sinSucursal: sinSucursal ? true : undefined,
      rol: rol !== 'todos' ? rol : undefined,
      estado: estado !== 'todos' ? estado : undefined,
      busqueda: busqueda ? busqueda : undefined,
    }

    // Obtener todos los usuarios
    const todosLosUsuarios = await obtenerUsuarios(filtros)
    
    // Calcular paginación
    const totalUsuarios = todosLosUsuarios.length
    const totalPages = Math.ceil(totalUsuarios / USUARIOS_POR_PAGINA)
    const paginaActual = Math.min(pagina, totalPages || 1)
    const inicio = (paginaActual - 1) * USUARIOS_POR_PAGINA
    const fin = inicio + USUARIOS_POR_PAGINA
    
    // Obtener usuarios de la página actual
    const usuariosPaginados = todosLosUsuarios.slice(inicio, fin)

    console.log('Usuarios obtenidos:', usuariosPaginados.length, `de ${totalUsuarios}`)

    return NextResponse.json(jsonBigInt({
      success: true,
      usuarios: usuariosPaginados,
      total: totalUsuarios,
      paginaActual,
      totalPages,
    }))
  } catch (error) {
    console.error('Error en GET /api/usuarios:', error)
    return NextResponse.json(
      { message: 'Error del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    const user = session?.user as any

    if (!session || user?.tipo !== 'admin') {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, tipo } = body

    if (!id || !tipo) {
      return NextResponse.json({ message: 'Faltan datos requeridos' }, { status: 400 })
    }

    const usuario = await actualizarRolUsuario(BigInt(id), tipo)

    // Serializar BigInt para la respuesta JSON
    const usuarioSerializado = jsonBigInt(usuario)

    return NextResponse.json({ success: true, usuario: usuarioSerializado })
  } catch (error) {
    console.error('Error en PATCH /api/usuarios:', error)
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 })
  }
}
