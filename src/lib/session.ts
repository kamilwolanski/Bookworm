import { Session, getServerSession } from 'next-auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const session = async ({ session, token }: any) => {
  session.user.id = token.id;
  session.user.role = token.role;
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
