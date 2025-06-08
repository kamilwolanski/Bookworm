import { Session, getServerSession } from 'next-auth';

export const session = async ({ session, token }: any) => {
  session.user.id = token.id;
  return session;
};

export const getUserSession = async (): Promise<Session> => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  });

  return authUserSession;
};
