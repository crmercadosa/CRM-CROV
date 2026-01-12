import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    id_usuario?: string;
    email: string;
    nombre?: string;
    tipo?: string;
    email_verificado?: boolean;
  }

  interface Session {
    user: {
      id: string;
      id_usuario?: string;
      tipo?: string;
      email_verificado?: boolean;
    } & DefaultSession['user'];
  }

  interface JWT {
    id: string;
    id_usuario?: string;
    tipo?: string;
    email_verificado?: boolean;
  }
}
