import { clsx, type ClassValue } from 'clsx';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export const dedupeByValue = <T extends { value: string }>(arr: T[]) => {
  const m = new Map<string, T>();
  for (const o of arr) if (!m.has(o.value)) m.set(o.value, o);
  return [...m.values()];
};
