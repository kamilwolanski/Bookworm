import { ActionResult } from '@/types/actions';
import { useRouter } from 'next/navigation';
import { useOptimistic, useTransition } from 'react';

export function useOptimisticRating(initialUserRating: number) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [ratingOpt, setOptimistic] = useOptimistic<number, number>(
    initialUserRating,
    (_state, nextRate) => nextRate
  );

  function rate(next: number, fn: () => Promise<ActionResult>) {
    if (isPending || next === ratingOpt) return;

    startTransition(async () => {
      const prev = ratingOpt;
      setOptimistic(next);
      try {
        const res = await fn();

        if (res.isError) {
          setOptimistic(prev);

          return;
        }

        router.refresh();
      } catch {
        setOptimistic(prev);
      }
    });
  }

  return { ratingOpt, isPending, rate };
}
