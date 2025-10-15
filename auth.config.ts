import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

const config = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: '/',
  },
} satisfies NextAuthConfig;

export default config;
