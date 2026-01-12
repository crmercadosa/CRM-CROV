//api/negocios/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '../../../../services/login/Auth';
import { 
  updateNegocio,
  toggleNegocioStatus,
  deleteNegocio
} from '../../../../services/negocios/negocio';

/**
 * PUT - Actualizar un negocio completo
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

    const negocioActualizado = await updateNegocio(id, {
      nombre_negocio: body.nombre_negocio,
      giro: body.giro,
      ciudad: body.ciudad,
      horarios: body.horarios,
      url_redes_sociales: body.url_redes_sociales,
      estado: body.estado,
    });

    return NextResponse.json(negocioActualizado, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar negocio:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el negocio' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Cambiar el estado del negocio (activar/desactivar)
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

    const negocioActualizado = await toggleNegocioStatus(id, body.estado);

    return NextResponse.json(negocioActualizado, { status: 200 });
  } catch (error) {
    console.error('Error al cambiar estado de negocio:', error);
    return NextResponse.json(
      { error: 'Error al cambiar el estado del negocio' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Eliminar un negocio
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

    await deleteNegocio(id);

    return NextResponse.json(
      { message: 'Negocio eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al eliminar negocio:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el negocio' },
      { status: 500 }
    );
  }
}
