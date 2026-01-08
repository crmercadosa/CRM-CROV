import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    nombre?: string;
    tipo?: string;
  }

  interface Session {
    user: {
      id: string;
      tipo?: string;
    } & DefaultSession['user'];
  }

  interface JWT {
    id: string;
    tipo?: string;
  }
}
