import { Role } from '@prisma/client';
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    role?: Role;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      image: string;
      email: string;
      name: string;
    };
  }
}
