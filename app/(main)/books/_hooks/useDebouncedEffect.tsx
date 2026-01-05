import { useEffect, useRef } from "react";

export function useDebouncedEffect(
  effect: () => void,
  deps: unknown[],
  delay: number
) {
  const firstRun = useRef(true);

  useEffect(() => {
    // pomijamy initial render
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => clearTimeout(handler);
  }, [delay, effect]);
}
