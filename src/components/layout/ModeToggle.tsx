'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative cursor-pointer"
      aria-label={`Przełącz na ${next} mode`}
      onClick={() => setTheme(next)}
    >
      {mounted ? (
        isDark ? (
          <Moon
            className={[
              'absolute h-[1.2rem] w-[1.2rem] transition-all',
              isDark ? 'scale-100 rotate-0' : 'scale-0 rotate-90',
            ].join(' ')}
          />
        ) : (
          <Sun
            className={[
              'h-[1.2rem] w-[1.2rem] transition-all',
              isDark ? 'scale-0 -rotate-90' : 'scale-100 rotate-0',
            ].join(' ')}
          />
        )
      ) : null}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
