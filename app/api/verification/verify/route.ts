import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/services/verification/verification.service';
import { sendWelcomeEmail } from '@/services/verification/email.service';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/verification/verify
 * Verifica el token de verificación ingresado por el usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idUsuario, token } = body;

    if (!idUsuario || !token) {
      return NextResponse.json(
        { error: 'ID de usuario y token son requeridos' },
        { status: 400 }
      );
    }

    // Verificar el token
    const result = await verifyToken(idUsuario, token);

    // Enviar correo de bienvenida
    await sendWelcomeEmail(result.email, result.nombre || undefined);

    return NextResponse.json({
      success: true,
      message: '¡Verificación exitosa!',
      user: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al verificar el token' },
      { status: 400 }
    );
  }
}

