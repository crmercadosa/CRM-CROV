/**
 * --------------------------------------------------------------------------
 * Servicio de Usuarios
 * --------------------------------------------------------------------------
 *
 * Este servicio proporciona métodos para obtener y filtrar usuarios de la
 * plataforma. Incluye funcionalidad para filtros avanzados como:
 * - Usuarios sin negocios activos
 * - Filtrado por tipo de rol
 * - Filtrado por estado
 */

import { prisma } from "@/lib/prisma";

/**
 * --------------------------------------------------------------------------
 * Interfaces y Tipos
 * --------------------------------------------------------------------------
 */

export interface UsuarioConSucursal {
  id: bigint;
  email: string;
  nombre: string | null;
  tipo: string | null;
  estado: string | null;
  fecha_creacion: Date | null;
  sucursal: {
    id: bigint;
    nombre_negocio: string | null;
    estado: string | null;
  } | null;
}

export interface FiltrosUsuarios {
  sinSucursal?: boolean;
  rol?: string;
  estado?: string;
  busqueda?: string;
}

/**
 * --------------------------------------------------------------------------
 * Obtener todos los usuarios con opciones de filtrado
 * --------------------------------------------------------------------------
 */
export async function obtenerUsuarios(filtros: FiltrosUsuarios): Promise<UsuarioConSucursal[]> {
  try {
    // Excluir administradores por defecto
    const where: any = {
      tipo: {
        not: 'admin',
      },
    };

    // Filtro: usuarios sin negocios activos
    if (filtros.sinSucursal) {
      where.sucursal = {
        none: {},
      };
    }

    // Filtro: tipo de rol
    if (filtros.rol && filtros.rol !== 'todos') {
      where.tipo = filtros.rol;
    }

    // Filtro: estado
    if (filtros.estado && filtros.estado !== 'todos') {
      where.estado = filtros.estado;
    }

    // Filtro: búsqueda por email o nombre
    if (filtros.busqueda) {
      where.OR = [
        {
          email: {
            contains: filtros.busqueda,
            mode: 'insensitive',
          },
        },
        {
          nombre: {
            contains: filtros.busqueda,
            mode: 'insensitive',
          },
        },
      ];
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      include: {
        sucursal: {
          where: {
            estado: 'activo',
          },
          select: {
            id: true,
            nombre_negocio: true,
            estado: true,
          },
          take: 1,
        },
      },
      orderBy: {
        fecha_creacion: 'desc',
      },
    });

    return usuarios.map(usuario => ({
      ...usuario,
      sucursal: usuario.sucursal[0] || null,
    }));
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('No se pudieron obtener los usuarios');
  }
}

/**
 * --------------------------------------------------------------------------
 * Obtener un usuario por ID
 * --------------------------------------------------------------------------
 */
export async function obtenerUsuarioById(id: bigint): Promise<UsuarioConSucursal | null> {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: {
        sucursal: {
          where: {
            estado: 'activo',
          },
          select: {
            id: true,
            nombre_negocio: true,
            estado: true,
          },
          take: 1,
        },
      },
    });

    if (!usuario) return null;

    return {
      ...usuario,
      sucursal: usuario.sucursal[0] || null,
    };
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw new Error('No se pudo obtener el usuario');
  }
}

/**
 * --------------------------------------------------------------------------
 * Obtener estadísticas de usuarios
 * --------------------------------------------------------------------------
 */
export async function obtenerEstadisticasUsuarios() {
  try {
    const total = await prisma.usuario.count({
      where: {
        tipo: {
          not: 'admin',
        },
      },
    });

    const sinSucursal = await prisma.usuario.count({
      where: {
        AND: [
          {
            tipo: {
              not: 'admin',
            },
          },
          {
            sucursal: {
              none: {},
            },
          },
        ],
      },
    });

    const activos = await prisma.usuario.count({
      where: {
        AND: [
          {
            tipo: {
              not: 'admin',
            },
          },
          { estado: 'activo' },
        ],
      },
    });

    const inactivos = await prisma.usuario.count({
      where: {
        AND: [
          {
            tipo: {
              not: 'admin',
            },
          },
          { estado: 'inactivo' },
        ],
      },
    });

    const rolesCuenta = await prisma.usuario.groupBy({
      by: ['tipo'],
      where: {
        tipo: {
          not: 'admin',
        },
      },
      _count: true,
    });

    return {
      total,
      sinSucursal,
      activos,
      inactivos,
      porRol: rolesCuenta,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw new Error('No se pudieron obtener las estadísticas');
  }
}

/**
 * --------------------------------------------------------------------------
 * Obtener tipos de rol disponibles
 * --------------------------------------------------------------------------
 */
export async function obtenerTiposRol() {
  try {
    // Obtener roles distintos (excluyendo admin)
    const roles = await prisma.usuario.findMany({
      where: {
        tipo: {
          not: 'admin',
        },
      },
      distinct: ['tipo'],
      select: {
        tipo: true,
      },
    });

    const rolesArray = roles
      .map((r) => r.tipo)
      .filter((r) => r !== 'admin') as string[];

    return rolesArray;
  } catch (error) {
    console.error('Error al obtener tipos de rol:', error);
    throw new Error('No se pudieron obtener los tipos de rol');
  }
}

/**
 * --------------------------------------------------------------------------
 * Actualizar el rol de un usuario
 * --------------------------------------------------------------------------
 */
export async function actualizarRolUsuario(id: bigint, nuevoRol: 'cliente' | 'admin') {
  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { tipo: nuevoRol },
    });
    return usuario;
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    throw new Error('No se pudo actualizar el rol del usuario');
  }
}
