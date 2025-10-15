// server session helpers

import type { Session } from 'next-auth';
import { auth } from '../../auth';

// (callback session przeniesiony do auth.ts → patrz wyżej)

export const getUserSession = async (): Promise<Session | null> => {
  return await auth();
};
