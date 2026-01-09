// api/sucursales/route.ts
import { NextResponse } from 'next/server';
import { auth } from '../../../services/login/Auth';
import { getSucursalesByUsuario, createSucursal } from '../../../services/sucursales/sucursal';

/**
 * GET - Obtener todas las sucursales del usuario autenticado
 */

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Convertir el ID de string a number
    const userId = parseInt(session.user.id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    const sucursales = await getSucursalesByUsuario(userId);

    return NextResponse.json(sucursales);
  } catch (error) {
    console.error('Error al obtener sucursales:', error);
    return NextResponse.json(
      { error: 'Error al obtener sucursales' },
      { status: 500 }
    );
  }
}

/**
 * POST - Crear una nueva sucursal
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Convertir el ID de string a number
    const userId = parseInt(session.user.id, 10);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validaciones básicas
    if (!body.nombre_negocio || !body.giro || !body.ciudad || !body.horarios) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre_negocio, giro, ciudad, horarios' },
        { status: 400 }
      );
    }

    // Crear la sucursal con el id del usuario autenticado
    const nuevaSucursal = await createSucursal({
      id_usuario: userId,
      nombre_negocio: body.nombre_negocio,
      giro: body.giro,
      ciudad: body.ciudad,
      horarios: body.horarios,
      url_redes_sociales: body.url_redes_sociales || '',
      estado: body.estado || 'activo',
    });

    return NextResponse.json(nuevaSucursal, { status: 201 });
  } catch (error) {
    console.error('Error al crear sucursal:', error);
    return NextResponse.json(
      { error: 'Error al crear la sucursal' },
      { status: 500 }
    );
  }
}