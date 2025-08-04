import prisma from '@/lib/prisma';
import { session } from '@/lib/session';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile?.email) {
        throw new Error('No profile');
      }

      await prisma.user.upsert({
        where: {
          email: profile.email,
        },
        create: {
          email: profile.email,
          name: profile.name,
        },
        update: {
          name: profile.name,
          avatarUrl: profile.picture,
        },
      });
      return true;
    },
    session,
    async jwt({ token, profile }) {
      if (profile) {
        const user = await prisma.user.findUnique({
          where: {
            email: profile.email,
          },
        });

        if (!user) {
          throw new Error('No user found');
        }
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
  },
  pages: {
    signIn: '/login', // opcjonalna własna strona logowania
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
