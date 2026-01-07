'use server'

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../src/generated/prisma/client';

async function createUser(name: string, email: string, passwordHash: string) {
  try {
    await prisma.usuario.create({
      data: { nombre: name, email, password_hash: passwordHash },
    });
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
  password?: string;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
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

  try {
    await createUser(name, email, hashedPassword);
  } catch (error: any) {
    return {
      message: error.message || 'Error al crear la cuenta.',
    };
  }

  // Retornar los datos para que el cliente haga el login
  return {
    success: true,
    email,
    password,
  };
}