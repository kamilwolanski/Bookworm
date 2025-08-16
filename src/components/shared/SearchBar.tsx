'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [value, setValue] = useState(initialSearch);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
        params.set('page', '1'); // resetujemy stronę przy wyszukiwaniu
      } else {
        params.delete('search');
      }

      router.push(`?${params.toString()}`);
    }, 500); // debounce

    return () => clearTimeout(delayDebounce);
  }, [router, searchParams, value]);

  return (
    <div className="max-w-sm w-full ">
      <Input
        placeholder="Wyszukaj książke..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full"
      />
    </div>
  );
}
