// api/negocios/route.ts
import { NextResponse } from 'next/server';
import { auth } from '../../../services/login/Auth';
import { getNegociosByUsuario, createNegocio } from '../../../services/negocios/negocio';

/**
 * GET - Obtener todos los negocios del usuario autenticado
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

    const negocios = await getNegociosByUsuario(userId);

    return NextResponse.json(negocios);
  } catch (error) {
    console.error('Error al obtener negocios:', error);
    return NextResponse.json(
      { error: 'Error al obtener negocios' },
      { status: 500 }
    );
  }
}

/**
 * POST - Crear un nuevo negocio
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

    // Crear el negocio con el id del usuario autenticado
    const nuevoNegocio = await createNegocio({
      id_usuario: userId,
      nombre_negocio: body.nombre_negocio,
      giro: body.giro,
      ciudad: body.ciudad,
      horarios: body.horarios,
      url_redes_sociales: body.url_redes_sociales || '',
      estado: body.estado || 'activo',
    });

    return NextResponse.json(nuevoNegocio, { status: 201 });
  } catch (error) {
    console.error('Error al crear negocio:', error);
    return NextResponse.json(
      { error: 'Error al crear el negocio' },
      { status: 500 }
    );
  }
}
