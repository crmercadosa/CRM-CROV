//services/sucursales/sucursal.ts
import {prisma} from '../../lib/prisma';


/**
 * --------------------------------------------------------------------------
 * Funcion para obtener los datos de las sucursales que tieene un usuario
 * en la base de datos.
 * --------------------------------------------------------------------------
 * 
 */

export async function getSucursalesByUsuario(id_usuario: bigint | number) {
  try {
    const sucursales = await prisma.sucursal.findMany({
      where: {
        id_usuario: BigInt(id_usuario),
      },
      orderBy: {
        id: 'desc', // Orden descendente por ID (más reciente primero)
      },
    });

    // Convertir BigInt a string para evitar problemas de serialización en Next.js
    return sucursales.map(sucursal => ({
      ...sucursal,
      id: sucursal.id.toString(),
      id_usuario: sucursal.id_usuario.toString(),
    }));
  } catch (error) {
    console.error('Error al obtener sucursales:', error);
    throw new Error('No se pudieron obtener las sucursales');
  }
}

/**
 * --------------------------------------------------------------------------
 * Funcion para crear una nueva sucursal dentro de la base de datos
 * --------------------------------------------------------------------------
 */

export async function createSucursal(data: {
  id_usuario: bigint | number;
  nombre_negocio: string;
  giro: string;
  ciudad: string;
  horarios: string;
  url_redes_sociales?: string;
  estado?: 'activo' | 'inactivo';
}) {
  try {
    const nuevaSucursal = await prisma.sucursal.create({
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
      ...nuevaSucursal,
      id: nuevaSucursal.id.toString(),
      id_usuario: nuevaSucursal.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al crear sucursal:', error);
    throw new Error('No se pudo crear la sucursal');
  }
}


/**
 * --------------------------------------------------------------------------
 * Función para actualizar una sucursal existente.
 * --------------------------------------------------------------------------
 */
export async function updateSucursal(
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
    
    const sucursalActualizada = await prisma.sucursal.update({
      where: {
        id: BigInt(id),
      },
      data: updateData,
    });

    // Convertir BigInt a string
    return {
      ...sucursalActualizada,
      id: sucursalActualizada.id.toString(),
      id_usuario: sucursalActualizada.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al actualizar sucursal:', error);
    throw new Error('No se pudo actualizar la sucursal');
  }
}

/**
 * --------------------------------------------------------------------------
 * Función para cambiar el estado de una sucursal (activar/desactivar).
 * --------------------------------------------------------------------------
 */
export async function toggleSucursalStatus(
  id: bigint | number | string,
  nuevoEstado: 'activo' | 'inactivo'
) {
  try {
    const sucursalActualizada = await prisma.sucursal.update({
      where: {
        id: BigInt(id),
      },
      data: {
        estado: nuevoEstado,
      },
    });

    return {
      ...sucursalActualizada,
      id: sucursalActualizada.id.toString(),
      id_usuario: sucursalActualizada.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al cambiar estado de sucursal:', error);
    throw new Error('No se pudo cambiar el estado de la sucursal');
  }
}

/**
 * --------------------------------------------------------------------------
 * Función para eliminar una sucursal (eliminación física).
 * --------------------------------------------------------------------------
 */
export async function deleteSucursal(id: bigint | number | string) {
  try {
    const sucursalEliminada = await prisma.sucursal.delete({
      where: {
        id: BigInt(id),
      },
    });

    return {
      ...sucursalEliminada,
      id: sucursalEliminada.id.toString(),
      id_usuario: sucursalEliminada.id_usuario.toString(),
    };
  } catch (error) {
    console.error('Error al eliminar sucursal:', error);
    throw new Error('No se pudo eliminar la sucursal');
  }
}