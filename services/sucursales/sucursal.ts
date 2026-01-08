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