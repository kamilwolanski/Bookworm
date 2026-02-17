import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';

const config = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

        ...(process.env.NODE_ENV === "test"
      ? [
          Credentials({
            name: "E2E Login",
            credentials: {
              email: {},
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;

              const email = credentials.email as string;

              let user = await prisma.user.findUnique({
                where: { email: email },
              });

              if (!user) {
                user = await prisma.user.create({
                  data: {
                    email: email,
                    name: "E2E Test User",
                    role: "USER",
                  },
                });
              }

              return user;
            },
          }),
        ]
      : []),
  ],
  pages: {
    signIn: '/',
  },
} satisfies NextAuthConfig;

export default config;
