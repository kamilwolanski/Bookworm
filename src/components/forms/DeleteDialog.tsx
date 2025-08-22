'use client';

import * as React from 'react';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReactNode, startTransition, useActionState, useEffect } from 'react';
import { Action, ActionResult } from '@/types/actions';
import { useRouter, usePathname } from 'next/navigation';

const DeleteDialog = ({
  id,
  dialogTitle,
  removeAction,
  revalidatePath,
  onSuccess,
}: {
  id: string;
  dialogTitle: string | ReactNode;
  removeAction: Action<[unknown, string], void>;
  revalidatePath: string;
  onSuccess?: () => void;
}) => {
  const [state, doAction, isPending] = useActionState<ActionResult, string>(
    removeAction,
    { isError: false }
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('state', state)
    if (state.status === 'success' && !state.isError) {
      onSuccess?.();
      setTimeout(() => {
        router.refresh();
        if (pathname !== revalidatePath) router.push(revalidatePath);
      }, 100);
    }
  }, [state, router, pathname, revalidatePath, onSuccess]);

  return (
    <DialogContent
      className="
        sm:max-w-md p-6 rounded-2xl
    border border-border
    shadow-2xl
    bg-background/95 backdrop-blur
    supports-[backdrop-filter]:bg-background/80 
    "
    >
      <DialogHeader>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogDescription>
          Usunięcie jest trwałe i nie będzie można go cofnąć.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" className="cursor-pointer">
            Anuluj
          </Button>
        </DialogClose>

        <Button
          type="button"
          disabled={isPending}
          className="cursor-pointer"
          onClick={() => {
            startTransition(() => {
              doAction(id);
            });
          }}
        >
          {isPending ? 'Usuwanie...' : 'Usuń'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteDialog;
