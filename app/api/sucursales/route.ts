import { NextResponse } from 'next/server';
import { useSession } from 'next-auth/react';
import { getSucursalesByUsuario } from '../../../services/sucursales/sucursal';

export async function GET(request: Request) {
  try {
    const {data: session} = useSession();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
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