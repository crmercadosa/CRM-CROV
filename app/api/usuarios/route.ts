/**
 * --------------------------------------------------------------------------
 * Ruta API para obtener usuarios con filtros
 * --------------------------------------------------------------------------
 *
 * GET /api/usuarios
 *
 * Parámetros de query:
 * - sinSucursal: boolean - Filtrar usuarios sin sucursales
 * - rol: string - Filtrar por tipo de rol
 * - estado: string - Filtrar por estado
 * - busqueda: string - Búsqueda por email o nombre
 */

import { NextRequest, NextResponse } from 'next/server'
import { obtenerUsuarios, actualizarRolUsuario, FiltrosUsuarios } from '@/services/usuarios/usuario.service'
import { auth } from '@/services/login/Auth'

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

    // Construir objeto de filtros
    const filtros: FiltrosUsuarios = {
      sinSucursal: sinSucursal ? true : undefined,
      rol: rol !== 'todos' ? rol : undefined,
      estado: estado !== 'todos' ? estado : undefined,
      busqueda: busqueda ? busqueda : undefined,
    }

    // Obtener usuarios
    const usuarios = await obtenerUsuarios(filtros)

    console.log('Usuarios obtenidos:', usuarios.length)

    return NextResponse.json(jsonBigInt({
      success: true,
      usuarios,
      total: usuarios.length,
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
