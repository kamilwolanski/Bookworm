'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AliasesInputProps = {
  value?: string[];
  onChange?: (aliases: string[]) => void;
  name?: string; // przydatne do RHF albo zwykłego formularza
};

export function AliasesInput({
  value = [],
  onChange,
  name,
}: AliasesInputProps) {
  const [input, setInput] = useState('');

  const addAlias = () => {
    const alias = input.trim();
    if (!alias) return;
    if (value.includes(alias)) {
      setInput('');
      return;
    }
    onChange?.([...value, alias]);
    setInput('');
  };

  const removeAlias = (alias: string) => {
    onChange?.(value.filter((a) => a !== alias));
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addAlias();
            }
          }}
          placeholder="Dodaj alias i naciśnij Enter"
        />
        <Button type="button" variant="secondary" onClick={addAlias}>
          Dodaj
        </Button>
      </div>

      {/* Ukryty input dla zwykłego <form>, żeby aliasy poszły w FormData */}
      {name && (
        <input type="hidden" name={name} value={JSON.stringify(value)} />
      )}

      <div className="flex flex-wrap gap-2">
        {value.map((alias) => (
          <Badge
            key={alias}
            variant="secondary"
            className="px-2 py-1 text-sm cursor-pointer"
            onClick={() => removeAlias(alias)}
          >
            {alias} ✕
          </Badge>
        ))}
      </div>
    </div>
  );
}
