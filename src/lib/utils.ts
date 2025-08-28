import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dedupeByValue = <T extends { value: string }>(arr: T[]) => {
  const m = new Map<string, T>();
  for (const o of arr) if (!m.has(o.value)) m.set(o.value, o);
  return [...m.values()];
};
