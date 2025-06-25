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
import { ActionResult } from '@/types/actions';
import { useRouter } from 'next/navigation';
import { removeBookAction } from '@/app/(dashboard)/books/actions';
import { usePathname } from 'next/navigation';

const DeleteBtn = ({
  bookTitle,
  bookId,
  children,
}: {
  bookTitle: string;
  bookId: string;
  children: ReactNode;
}) => {
  const [state, doAction, isPending] = useActionState<ActionResult, string>(
    removeBookAction,
    { isError: false }
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.status === 'success' && !state.isError) {
      router.refresh();
      if (pathname !== '/books') router.push('/books');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router]);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Czy na pewno chcesz usunąć <b>„{bookTitle}”</b> ze swojej
            biblioteczki?
          </DialogTitle>
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
