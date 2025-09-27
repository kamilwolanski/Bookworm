// hooks/useOptimisticReadingStatus.ts
'use client';

import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ActionResult } from '@/types/actions';
import type { ReadingStatus } from '@prisma/client';

type ChangeFn<T = unknown> = () => Promise<ActionResult<T>>;
export function useOptimisticReadingStatus(
  initial: ReadingStatus | undefined,
  options: { refreshOnSuccess?: boolean } = { refreshOnSuccess: true }
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [statusOpt, setStatusOpt] = useOptimistic<
    ReadingStatus | undefined,
    ReadingStatus | undefined
  >(initial, (_state, next) => next);

  function change<T = unknown>(next: ReadingStatus, fn: ChangeFn<T>) {
    if (isPending || next === statusOpt) return;

    const prev = statusOpt;
    setStatusOpt(next);

    startTransition(async () => {
      try {
        const res = await fn();
        if (res.isError) {
          setStatusOpt(prev);
          return;
        }
        if (options.refreshOnSuccess) {
          router.refresh();
        }
      } catch {
        setStatusOpt(prev);
      }
    });
  }

  return { statusOpt, isPending, change };
}
