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
import { COUNTRIES, CountryCode } from '@/lib/constants/countries';

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

  const selected = COUNTRIES.find((c) => c.value === value);

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
              <span className="text-base leading-none">{selected.icon}</span>
              <span className="truncate">{selected.label}</span>
              <span className="text-muted-foreground">({selected.value})</span>
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
                  key={country.value}
                  // CommandItem używa `value` do filtrowania po wpisaniu
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    const next = country.value;
                    onChange?.(next);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <span className="mr-2 text-base">{country.icon}</span>
                  <span className="truncate">{country.label}</span>
                  <span className="ml-2 text-muted-foreground">
                    ({country.value})
                  </span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === country.value ? 'opacity-100' : 'opacity-0'
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
