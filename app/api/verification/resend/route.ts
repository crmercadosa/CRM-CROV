import { NextRequest, NextResponse } from 'next/server';
import { resendVerificationToken } from '@/services/verification/verification.service';
import { sendVerificationEmail } from '@/services/verification/email.service';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/verification/resend
 * Reenvía un nuevo token de verificación al usuario
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idUsuario } = body;

    if (!idUsuario) {
      return NextResponse.json(
        { error: 'El ID de usuario es requerido' },
        { status: 400 }
      );
    }

    // Obtener datos del usuario
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: BigInt(idUsuario) },
      select: { nombre: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Generar nuevo token
    const verificationData = await resendVerificationToken(idUsuario);

    // Enviar correo
    await sendVerificationEmail(user.email, verificationData.token, user.nombre || undefined);

    return NextResponse.json({
      success: true,
      message: 'Se ha enviado un nuevo token de verificación a tu correo electrónico',
      expiresAt: verificationData.expiresAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error al reenviar el token' },
      { status: 400 }
    );
  }
}

