import { prisma } from '../../lib/prisma';
import crypto from 'crypto';

/**
 * Genera un token aleatorio y retorna su hash
 */
function generateToken(): { token: string; tokenHash: string } {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
}

/**
 * Calcula la fecha de expiración (10 minutos desde ahora)
 */
export function getExpirationTime(): Date {
  const now = new Date();
  return new Date(now.getTime() + 10 * 60 * 1000); // 10 minutos
}

/**
 * Crea un nuevo token de verificación para un usuario
 */
export async function createVerificationToken(idUsuario: string | number) {
  const { token, tokenHash } = generateToken();
  const expiresAt = getExpirationTime();
  const id = crypto.randomUUID();
  const idUsuarioBigInt = BigInt(idUsuario);

  try {
    await prisma.verification_tokens.create({
      data: {
        id,
        id_usuario: idUsuarioBigInt,
        token_hash: tokenHash,
        type: 'EMAIL_VERIFICATION',
        expires_at: expiresAt,
        used: false,
        attempts: 0,
      },
    });

    return {
      token,      // Token sin encriptar para enviar al usuario
      tokenHash,  // Hash guardado en BD
      expiresAt,
    };
  } catch (error: any) {
    throw new Error(`Error al crear token de verificación: ${error.message}`);
  }
}

/**
 * Verifica el token ingresado por el usuario
 */
export async function verifyToken(idUsuario: string | number, token: string) {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const idUsuarioBigInt = BigInt(idUsuario);

    const verificationToken = await prisma.verification_tokens.findFirst({
      where: {
        id_usuario: idUsuarioBigInt,
        type: 'EMAIL_VERIFICATION',
      },
    });

    if (!verificationToken) {
      throw new Error('No se encontró token de verificación');
    }

    // Verificar si ya fue usado
    if (verificationToken.used) {
      throw new Error('El token ya ha sido utilizado');
    }

    // Verificar si ha excedido los intentos (máximo 5)
    if (verificationToken.attempts >= 5) {
      throw new Error('Demasiados intentos fallidos. Por favor solicita un nuevo token.');
    }

    // Verificar si ha expirado
    if (new Date() > verificationToken.expires_at) {
      throw new Error('El token de verificación ha expirado. Por favor solicita uno nuevo.');
    }

    // Verificar si el hash del token es correcto
    if (verificationToken.token_hash !== tokenHash) {
      // Incrementar intentos fallidos
      await prisma.verification_tokens.update({
        where: { id: verificationToken.id },
        data: { attempts: verificationToken.attempts + 1 },
      });

      throw new Error('El token de verificación es incorrecto');
    }

    // Token correcto: marcar como usado y verificar usuario
    await prisma.verification_tokens.update({
      where: { id: verificationToken.id },
      data: { used: true },
    });

    const verifiedUser = await prisma.usuario.update({
      where: { id_usuario: idUsuarioBigInt },
      data: { email_verificado: true },
      select: {
        id_usuario: true,
        email: true,
        nombre: true,
      },
    });

    return verifiedUser;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Obtiene el estado de verificación del usuario
 */
export async function getVerificationStatus(idUsuario: string | number) {
  try {
    const idUsuarioBigInt = BigInt(idUsuario);
    
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: idUsuarioBigInt },
      select: {
        id_usuario: true,
        email: true,
        email_verificado: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Obtener token activo más reciente
    const activeToken = await prisma.verification_tokens.findFirst({
      where: {
        id_usuario: idUsuarioBigInt,
        type: 'EMAIL_VERIFICATION',
        used: false,
      },
      orderBy: { created_at: 'desc' },
    });

    return {
      verificado: user.email_verificado,
      expiresAt: activeToken?.expires_at || null,
      intentosFallidos: activeToken?.attempts || 0,
      tiempoRestante: activeToken?.expires_at
        ? Math.max(0, Math.ceil((activeToken.expires_at.getTime() - Date.now()) / 1000))
        : null,
    };
  } catch (error: any) {
    throw error;
  }
}

/**
 * Reenvía un nuevo token de verificación
 */
export async function resendVerificationToken(idUsuario: string | number) {
  try {
    const idUsuarioBigInt = BigInt(idUsuario);
    
    const user = await prisma.usuario.findUnique({
      where: { id_usuario: idUsuarioBigInt },
      select: { id_usuario: true, email_verificado: true },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.email_verificado) {
      throw new Error('La cuenta ya está verificada');
    }

    // Invalidar tokens anteriores
    await prisma.verification_tokens.updateMany({
      where: {
        id_usuario: idUsuarioBigInt,
        type: 'EMAIL_VERIFICATION',
        used: false,
      },
      data: { used: true },
    });

    return await createVerificationToken(idUsuario);
  } catch (error: any) {
    throw error;
  }
}

