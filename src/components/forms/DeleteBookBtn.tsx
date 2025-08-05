/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  ReactNode,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { Action, ActionResult } from '@/types/actions';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const DeleteBtn = ({
  bookId,
  dialogTitle,
  children,
  removeBookAction,
  revalidatePath,
}: {
  bookId: string;
  dialogTitle: string | ReactNode;
  children: ReactNode;
  removeBookAction: Action<[unknown, string], void>;
  revalidatePath: string;
}) => {
  const [state, doAction, isPending] = useActionState<ActionResult, string>(
    removeBookAction,
    { isError: false }
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.status === 'success' && !state.isError) {
      setOpen(false);

      setTimeout(() => {
        router.refresh();
        if (pathname !== revalidatePath) router.push(revalidatePath);
      }, 100);
    }
  }, [state, router, pathname]);

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Usunięcie jest trwałe i nie będzie można go cofnąć.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Anuluj
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isPending}
            className="cursor-pointer"
            onClick={() => {
              startTransition(() => {
                doAction(bookId);
              });
            }}
          >
            {isPending ? 'Usuwanie...' : 'Usuń'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBtn;
