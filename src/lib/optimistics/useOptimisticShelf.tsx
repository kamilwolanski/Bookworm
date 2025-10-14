import { useOptimistic, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { ActionResult } from '@/types/actions';

type ShelfAction = { type: 'add' | 'remove' };

export function useOptimisticShelf(initialOnShelf: boolean) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [onShelfOptimistic, setOptimistic] = useOptimistic<
    boolean,
    ShelfAction
  >(initialOnShelf, (_state, action) => (action.type === 'add' ? true : false));

  function toggle<T = unknown>(
    next: 'add' | 'remove',
    fn: () => Promise<ActionResult<T>>
  ) {
    startTransition(async () => {
      if (
        (next === 'add' && onShelfOptimistic) ||
        (next === 'remove' && !onShelfOptimistic)
      ) {
        return;
      }

      setOptimistic({ type: next });

      try {
        const res = await fn();

        if (res.isError) {
          setOptimistic({ type: next === 'add' ? 'remove' : 'add' });

          return;
        }

        router.refresh();
      } catch {
        setOptimistic({ type: next === 'add' ? 'remove' : 'add' });
      }
    });
  }

  return { onShelfOptimistic, isPending, toggle };
}
