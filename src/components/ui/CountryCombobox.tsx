'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// --- Dane krajów (możesz rozszerzyć listę) ---
const COUNTRIES = [
  { code: 'pl', name: 'Polska', flag: '🇵🇱' },
  { code: 'de', name: 'Niemcy', flag: '🇩🇪' },
  { code: 'us', name: 'Stany Zjednoczone', flag: '🇺🇸' },
  { code: 'gb', name: 'Wielka Brytania', flag: '🇬🇧' },
  { code: 'fr', name: 'Francja', flag: '🇫🇷' },
  { code: 'es', name: 'Hiszpania', flag: '🇪🇸' },
  { code: 'it', name: 'Włochy', flag: '🇮🇹' },
  { code: 'ua', name: 'Ukraina', flag: '🇺🇦' },
  { code: 'cz', name: 'Czechy', flag: '🇨🇿' },
  { code: 'sk', name: 'Słowacja', flag: '🇸🇰' },
] as const;

type CountryCode = (typeof COUNTRIES)[number]['code'];

export const COUNTRY_CODES = [
  'pl',
  'de',
  'us',
  'gb',
  'fr',
  'es',
  'it',
  'ua',
  'cz',
  'sk',
];

// --- Sam kombajn (standalone), kontrolowany z zewnątrz przez value/onChange ---
type CountryComboboxProps = {
  value?: CountryCode;
  onChange?: (value: CountryCode) => void;
  placeholder?: string;
  className?: string;
};

export function CountryCombobox({
  value,
  onChange,
  placeholder = 'Wybierz kraj...',
  className,
}: CountryComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selected = COUNTRIES.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-[260px] justify-between border-border border bg-input shadow-lg hover:bg-input cursor-pointer',
            className
          )}
        >
          {selected ? (
            <span className="flex items-center gap-2 truncate">
              <span className="text-base leading-none">{selected.flag}</span>
              <span className="truncate">{selected.name}</span>
              <span className="text-muted-foreground">({selected.code})</span>
            </span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Szukaj kraju..." className="h-9" />
          <CommandList>
            <CommandEmpty>Brak wyników.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.code}
                  // CommandItem używa `value` do filtrowania po wpisaniu
                  value={`${country.name} ${country.code}`}
                  onSelect={() => {
                    const next = country.code;
                    onChange?.(next);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <span className="mr-2 text-base">{country.flag}</span>
                  <span className="truncate">{country.name}</span>
                  <span className="ml-2 text-muted-foreground">
                    ({country.code})
                  </span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === country.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
