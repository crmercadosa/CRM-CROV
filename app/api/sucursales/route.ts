// api/sucursales/route.ts
import { NextResponse } from 'next/server';
import { auth } from '../../../services/login/Auth';
import { getSucursalesByUsuario } from '../../../services/sucursales/sucursal';

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