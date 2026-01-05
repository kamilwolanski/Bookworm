// server session helpers

import type { Session } from 'next-auth';
import { auth } from '../auth';


export const getUserSession = async (): Promise<Session | null> => {
  return await auth();
};
