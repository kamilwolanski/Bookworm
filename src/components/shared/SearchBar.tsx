/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { SheetTrigger } from '@/components/ui/sheet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchBar({
  placeholder,
  showSheetTrigger = true,
}: {
  placeholder: string;
  showSheetTrigger?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchFromUrl = searchParams.get('search') || '';
  const [value, setValue] = useState(searchFromUrl);

  // synchronizacja ze stanem URL
  useEffect(() => {
    setValue(searchFromUrl);
  }, []);

  // debounce + aktualizacja URL
  useEffect(() => {
    const delay = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('search', value);
        params.set('page', '1');
      } else {
        params.delete('search');
      }
      router.replace(`?${params.toString()}`);
    }, 500);
    return () => clearTimeout(delay);
  }, [value, router, searchParams]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-10 pr-12 py-5"
      />

      {showSheetTrigger && (
        <div className="lg:hidden">
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-linear-to-tr from-primary to-secondary text-white shadow-lg hover:opacity-90 w-8 h-8 cursor-pointer"
            >
              <SlidersHorizontal className="h-3 w-3" />
            </Button>
          </SheetTrigger>
        </div>
      )}
    </div>
  );
}
