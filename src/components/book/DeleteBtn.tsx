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
import { Trash2 } from 'lucide-react';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { ActionResult } from '@/types/actions';
import { useRouter } from 'next/navigation';
import { removeBook } from '@/app/(dashboard)/actions';

const DeleteBtn = ({
  bookTitle,
  bookId,
}: {
  bookTitle: string;
  bookId: string;
}) => {
  const [state, doAction, isPending] = useActionState<ActionResult, string>(
    removeBook,
    { isError: false }
  );
  const router = useRouter();

  useEffect(() => {
    if (state.status === 'success' && !state.isError) {
      router.refresh();
    }
  }, [state, router]);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black cursor-pointer">
          <Trash2 color="red" />
        </Button>
      </DialogTrigger>
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
