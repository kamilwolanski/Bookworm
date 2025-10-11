'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { polishGenres } from '@/app/admin/data';

type KeyMulti = 'genre' | 'status' | 'userrating';
type KeySingle = 'rating' | 'myshelf'; // dodaj tu inne single jeśli używasz

function removeValueFromCsv(csv: string, value: string) {
  const arr = csv.split(',').filter(Boolean);
  const next = arr.filter((x) => x.toLowerCase() !== value.toLowerCase());
  return next.join(',');
}

export default function ActiveFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  // 1) Zbierz aktywne filtry z URL
  const filters = useMemo(() => {
    const genre = sp.get('genre')?.split(',').filter(Boolean) ?? [];
    const status = sp.get('status')?.split(',').filter(Boolean) ?? [];
    const userrating = sp.get('userrating')?.split(',').filter(Boolean) ?? [];
    const rating = sp.get('rating') || '';

    return { genre, status, userrating, rating };
  }, [sp]);

  const hasAny =
    filters.genre.length ||
    filters.status.length ||
    filters.userrating.length ||
    !!filters.rating;

  // 2) Handlery usuwania
  const removeSingle = (key: KeySingle) => {
    const params = new URLSearchParams(sp.toString());
    params.delete(key);
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  };

  const removeFromMulti = (key: KeyMulti, value: string) => {
    const params = new URLSearchParams(sp.toString());
    const current = params.get(key);
    if (!current) return;

    const next = removeValueFromCsv(current, value);
    if (next) {
      params.set(key, next);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(sp.toString());
    ['genre', 'status', 'userrating', 'rating', 'myshelf', 'page'].forEach(
      (k) => params.delete(k)
    );
    router.replace(`?${params.toString()}`);
  };

  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {/* GENRE (multi) */}
      {filters.genre.map((g) => (
        <Badge
          key={`genre-${g}`}
          className="mx-1 py-1"
          onClick={() => removeFromMulti('genre', g)}
        >
          Gatunek: {polishGenres[decodeURIComponent(g)]}
          <XCircle className="!h-[15px] !w-[15px] shrink-0 ms-3" />
        </Badge>
      ))}

      {/* STATUS (multi) */}
      {filters.status.map((s) => (
        <Badge key={`status-${s}`} className="pr-1 pl-2 h-7">
          Status: {s}
          <button
            aria-label={`Usuń status ${s}`}
            className="inline-flex items-center justify-center rounded-sm hover:bg-muted/60 h-5 w-5"
            onClick={() => removeFromMulti('status', s)}
          >
            <XCircle className="!h-[15px] !w-[15px] shrink-0 ms-3" />
          </button>
        </Badge>
      ))}

      {/* USERRATING (multi) */}
      {filters.userrating.map((ur) => (
        <Badge
          key={`userrating-${ur}`}
          className="mx-1 py-1"
          onClick={() => removeFromMulti('userrating', ur)}
        >
          Moja ocena: {ur}
          <XCircle className="!h-[15px] !w-[15px] shrink-0 ms-2" />
        </Badge>
      ))}

      {/* RATING (single) */}
      {filters.rating && (
        <Badge className="mx-1 py-1" onClick={() => removeSingle('rating')}>
          Ocena: {filters.rating}
          <XCircle className="!h-[15px] !w-[15px] shrink-0 ms-2" />
        </Badge>
      )}

      <Badge onClick={clearAll} className="mx-1 py-1" variant="secondary">
        Wyczyść filtry
        <XCircle className="!h-[15px] !w-[15px] shrink-0 ms-2" />
      </Badge>
    </div>
  );
}
