'use server'

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../src/generated/prisma/client';
import { createVerificationToken } from '../verification/verification.service';
import { sendVerificationEmail } from '../verification/email.service';

async function createUser(name: string, email: string, passwordHash: string) {
  try {
    // Crear usuario sin verificar
    const user = await prisma.usuario.create({
      data: { 
        nombre: name, 
        email,
        provedor: 'EMAIL', 
        password_hash: passwordHash,
        email_verificado: false, // El usuario comienza sin verificar
        estado: 'activo',
      },
    });

    // Generar token de verificación
    const verificationData = await createVerificationToken(user.id_usuario.toString());

    // Enviar correo de verificación
    await sendVerificationEmail(email, verificationData.token, name);

    return user;
  } catch (error: any) {
    // Código de error de Prisma para violación de unicidad (ej. email duplicado)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('El correo electrónico ya está registrado.');
    }
    throw error;
  }
}

const SignupSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  email: z.string().email({ message: 'Introduce un correo electrónico válido.' }),
  password: z.string()
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    .regex(/[A-Z]/, { message: 'Debe contener al menos una letra mayúscula.' })
    .regex(/[0-9]/, { message: 'Debe contener al menos un número.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Debe contener al menos un carácter especial.' }),
});

export type SignupState = {
  success?: boolean;
  email?: string;
  idUsuario?: string;
  message?: string | null;
  requiresVerification?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
};

export async function signup(prevState: SignupState | undefined, formData: FormData): Promise<SignupState | undefined> {
  // Validar los campos del formulario
  const validatedFields = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos o son inválidos. Por favor revisa el formulario.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  let userId: string = '';
  try {
    const user = await createUser(name, email, hashedPassword);
    userId = user.id_usuario.toString();
  } catch (error: any) {
    return {
      message: error.message || 'Error al crear la cuenta.',
    };
  }

  // Retornar indicador de que se requiere verificación
  return {
    success: true,
    email,
    idUsuario: userId,
    requiresVerification: true,
    message: 'Cuenta creada. Por favor verifica tu correo electrónico para completar el registro.',
  };
}