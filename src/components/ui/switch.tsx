'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { LibraryBig } from 'lucide-react';
import { cn } from '@/lib/utils';

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer relative cursor-pointer inline-flex h-8 w-16 items-center rounded-full border border-transparent p-[2px] shadow-xs transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-purple-600',
        'data-[state=unchecked]:bg-gray-300',
        'hover:data-[state=checked]:bg-purple-700',
        'hover:data-[state=unchecked]:bg-gray-400',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'pointer-events-none flex items-center justify-center size-7 rounded-full bg-white ring-0 transition-transform',
          'data-[state=unchecked]:translate-x-0',
          'data-[state=checked]:translate-x-[calc(100%+4px)]',
          'peer-hover:scale-105'
        )}
      >
        <LibraryBig className="w-4 h-4 text-purple-600" />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
