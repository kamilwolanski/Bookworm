'use client';

import { useEffect, useRef } from 'react';

export function useDebouncedEffect(
  effect: () => void,
  deps: unknown[],
  delay: number
) {
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const handler = setTimeout(effect, delay);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
}
