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

export function normalizeForSearch(input: string): string {
  const map: Record<string, string> = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ź: 'z',
    ż: 'z',
    Ą: 'a',
    Ć: 'c',
    Ę: 'e',
    Ł: 'l',
    Ń: 'n',
    Ó: 'o',
    Ś: 's',
    Ź: 'z',
    Ż: 'z',
  };
  return input
    .split('')
    .map((ch) => map[ch] ?? ch)
    .join('')
    .normalize('NFD') // rozbije np. é na e + ́
    .replace(/\p{Diacritic}/gu, '') // usunie pozostałe diakrytyki
    .toLowerCase()
    .trim();
}
