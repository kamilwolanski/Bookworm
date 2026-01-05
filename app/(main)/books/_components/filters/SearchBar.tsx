'use client';

import { Input } from '@/components/ui/input';
import { SheetTrigger } from '@/components/ui/sheet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  showSheetTrigger?: boolean;
};

export function SearchBar({
  value = '',
  onChange,
  placeholder,
  showSheetTrigger = true,
}: Props) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />

      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
