// components/GenericCombobox.tsx
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

export type ComboboxItem<TValue extends string> = {
  /** Wartość zwracana do formularza / backendu */
  value: TValue;
  /** Label wyświetlany w UI (np. PL: "Twarda oprawa") */
  label: string;
  /** (opcjonalnie) ikonka/emoji na liście i przycisku */
  icon?: React.ReactNode;
  /** (opcjonalnie) małe dopiski po prawej, np. "(HARDCOVER)" */
  meta?: string;
  /** (opcjonalnie) dodatkowe frazy do wyszukiwania */
  searchTerms?: string[];
};

type GenericComboboxProps<TValue extends string> = {
  items: ReadonlyArray<ComboboxItem<TValue>>;
  value?: TValue;
  onChange?: (value: TValue) => void;
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  /** Jeżeli chcesz inaczej wyrenderować wybraną wartość na przycisku */
  renderSelected?: (item: ComboboxItem<TValue>) => React.ReactNode;
  /** Szerokość (Tailwind), domyślnie 260px żeby pasowało do Twojego stylu */
  widthClassName?: string; // np. "w-[300px]"
  searchable?: boolean;
};

export function GenericCombobox<TValue extends string>({
  items,
  value,
  onChange,
  placeholder = 'Wybierz...',
  className,
  searchPlaceholder = 'Szukaj...',
  emptyText = 'Brak wyników.',
  renderSelected,
  widthClassName = 'w-[260px]',
  searchable = true,
}: GenericComboboxProps<TValue>) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(
    () => items.find((i) => i.value === value),
    [items, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            widthClassName,
            'justify-between border-border border bg-input shadow-lg hover:bg-input cursor-pointer',
            className
          )}
        >
          {selected ? (
            renderSelected ? (
              renderSelected(selected)
            ) : (
              <span className="flex items-center gap-2 truncate">
                {selected.icon ? (
                  <span className="text-base leading-none">
                    {selected.icon}
                  </span>
                ) : null}
                <span className="truncate">{selected.label}</span>
                {selected.meta ? (
                  <span className="text-muted-foreground">{selected.meta}</span>
                ) : null}
              </span>
            )
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(widthClassName, 'p-0')}>
        <Command>
          {searchable ? (
            <CommandInput placeholder={searchPlaceholder} className="h-9" />
          ) : null}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const search = [
                  item.label,
                  item.value,
                  ...(item.searchTerms ?? []),
                ]
                  .filter(Boolean)
                  .join(' ');
                return (
                  <CommandItem
                    key={item.value}
                    value={search}
                    onSelect={() => {
                      onChange?.(item.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    {item.icon ? (
                      <span className="mr-2 text-base">{item.icon}</span>
                    ) : null}
                    <span className="truncate">{item.label}</span>
                    {item.meta ? (
                      <span className="ml-2 text-muted-foreground">
                        {item.meta}
                      </span>
                    ) : null}
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === item.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
