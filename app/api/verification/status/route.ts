import { NextRequest, NextResponse } from 'next/server';
import { getVerificationStatus } from '@/services/verification/verification.service';

/**
 * GET /api/verification/status?idUsuario=123
 * Obtiene el estado de verificación del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idUsuario = searchParams.get('idUsuario');

    if (!idUsuario) {
      return NextResponse.json(
        { error: 'El ID de usuario es requerido' },
        { status: 400 }
      );
    }

    const status = await getVerificationStatus(idUsuario);

    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al obtener estado de verificación' },
      { status: 400 }
    );
  }
}
