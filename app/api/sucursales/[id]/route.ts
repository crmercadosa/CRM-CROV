import { NextResponse } from 'next/server';
import { auth } from '../../../../services/login/Auth';
import { 
  updateSucursal,
  toggleSucursalStatus,
  deleteSucursal
} from '../../../../services/sucursales/sucursal';

/**
 * PUT - Actualizar una sucursal completa
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Await params para obtener el id
    const { id } = await params;
    const body = await request.json();

    const sucursalActualizada = await updateSucursal(id, {
      nombre_negocio: body.nombre_negocio,
      giro: body.giro,
      ciudad: body.ciudad,
      horarios: body.horarios,
      url_redes_sociales: body.url_redes_sociales,
      estado: body.estado,
    });

    return NextResponse.json(sucursalActualizada, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar sucursal:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la sucursal' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Cambiar el estado de la sucursal (activar/desactivar)
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Await params para obtener el id
    const { id } = await params;
    const body = await request.json();

    if (!body.estado || (body.estado !== 'activo' && body.estado !== 'inactivo')) {
      return NextResponse.json(
        { error: 'Estado inválido. Debe ser "activo" o "inactivo"' },
        { status: 400 }
      );
    }

    const sucursalActualizada = await toggleSucursalStatus(id, body.estado);

    return NextResponse.json(sucursalActualizada, { status: 200 });
  } catch (error) {
    console.error('Error al cambiar estado de sucursal:', error);
    return NextResponse.json(
      { error: 'Error al cambiar el estado de la sucursal' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Eliminar una sucursal
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await deleteSucursal(id);

    return NextResponse.json(
      { message: 'Sucursal eliminada exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar sucursal:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la sucursal' },
      { status: 500 }
    );
  }
}