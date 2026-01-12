//services/negocios/negocio.ts
import { prisma } from '../../lib/prisma';

/**
 * --------------------------------------------------------------------------
 * Funcion para obtener los datos de los negocios que tiene un usuario
 * en la base de datos.
 * --------------------------------------------------------------------------
 * 
 */

export async function getNegociosByUsuario(id_usuario: bigint | number) {
  try {
    const negocios = await prisma.sucursal.findMany({
      where: {
        id_usuario: BigInt(id_usuario),
      },
      orderBy: {
        id: 'desc', // Orden descendente por ID (más reciente primero)
      },
    });

    // Convertir BigInt a string para evitar problemas de serialización en Next.js
    return negocios.map(negocio => ({
      ...negocio,
      id: negocio.id.toString(),
      id_usuario: negocio.id_usuario.toString(),
    }));
  } catch (error) {
    console.error('Error al obtener negocios:', error);
    throw new Error('No se pudieron obtener los negocios');
  }
}

/**
 * --------------------------------------------------------------------------
 * Funcion para crear un nuevo negocio dentro de la base de datos
 * --------------------------------------------------------------------------
 */

export async function createNegocio(data: {
  id_usuario: bigint | number;
  nombre_negocio: string;
  giro: string;
  ciudad: string;
  horarios: string;
  url_redes_sociales?: string;
  estado?: 'activo' | 'inactivo';
}) {
  try {
    const nuevoNegocio = await prisma.sucursal.create({
      data: {
        id_usuario: BigInt(data.id_usuario),
        nombre_negocio: data.nombre_negocio,
        giro: data.giro,
        ciudad: data.ciudad,
        horarios: data.horarios,
        url_redes_sociales: data.url_redes_sociales || '',
        estado: data.estado || 'activo',
      },
    });

    // Convertir BigInt a string para evitar problemas de serialización
    return {
      ...nuevoNegocio,
      id: nuevoNegocio.id.toString(),
      id_usuario: nuevoNegocio.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al crear negocio:', error);
    throw new Error('No se pudo crear el negocio');
  }
}


/**
 * --------------------------------------------------------------------------
 * Función para actualizar un negocio existente.
 * --------------------------------------------------------------------------
 */
export async function updateNegocio(
  id: bigint | number | string,
  data: {
    nombre_negocio?: string;
    giro?: string;
    ciudad?: string;
    horarios?: string;
    url_redes_sociales?: string;
    estado?: 'activo' | 'inactivo';
  }
) {
  try {
    // Construir el objeto data solo con los campos que vienen definidos
    const updateData: any = {};
    
    if (data.nombre_negocio !== undefined) updateData.nombre_negocio = data.nombre_negocio;
    if (data.giro !== undefined) updateData.giro = data.giro;
    if (data.ciudad !== undefined) updateData.ciudad = data.ciudad;
    if (data.horarios !== undefined) updateData.horarios = data.horarios;
    if (data.url_redes_sociales !== undefined) updateData.url_redes_sociales = data.url_redes_sociales;
    if (data.estado !== undefined) updateData.estado = data.estado;
    
    const negocioActualizado = await prisma.sucursal.update({
      where: {
        id: BigInt(id),
      },
      data: updateData,
    });

    // Convertir BigInt a string
    return {
      ...negocioActualizado,
      id: negocioActualizado.id.toString(),
      id_usuario: negocioActualizado.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al actualizar negocio:', error);
    throw new Error('No se pudo actualizar el negocio');
  }
}

/**
 * --------------------------------------------------------------------------
 * Función para cambiar el estado de un negocio (activar/desactivar).
 * --------------------------------------------------------------------------
 */
export async function toggleNegocioStatus(
  id: bigint | number | string,
  nuevoEstado: 'activo' | 'inactivo'
) {
  try {
    const negocioActualizado = await prisma.sucursal.update({
      where: {
        id: BigInt(id),
      },
      data: {
        estado: nuevoEstado,
      },
    });

    return {
      ...negocioActualizado,
      id: negocioActualizado.id.toString(),
      id_usuario: negocioActualizado.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al cambiar estado de negocio:', error);
    throw new Error('No se pudo cambiar el estado del negocio');
  }
}

/**
 * --------------------------------------------------------------------------
 * Función para eliminar un negocio (eliminación física).
 * --------------------------------------------------------------------------
 */
export async function deleteNegocio(id: bigint | number | string) {
  try {
    const negocioEliminado = await prisma.sucursal.delete({
      where: {
        id: BigInt(id),
      },
    });

    return {
      ...negocioEliminado,
      id: negocioEliminado.id.toString(),
      id_usuario: negocioEliminado.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al eliminar negocio:', error);
    throw new Error('No se pudo eliminar el negocio');
  }
}
