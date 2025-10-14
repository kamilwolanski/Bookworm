'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { ReactNode, useActionState, startTransition } from 'react';
import { ActionResult } from '@/types/actions';
import { deleteReviewAction } from '@/app/(main)/books/actions/reviewActions';

const DeleteReviewDialog = ({
  reviewId,
  bookId,
  dialogTitle,
  onlyContent = false,
  children,
  afterSuccess,
}: {
  reviewId: string;
  bookId: string;
  dialogTitle: string | ReactNode;
  onlyContent?: boolean;
  children?: ReactNode;
  afterSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [state, doAction, isPending] = useActionState<
    ActionResult,
    {
      reviewId: string;
      bookId: string;
    }
  >(deleteReviewAction, { isError: false });

  useEffect(() => {
    if (state.status === 'success') {
      if (afterSuccess) afterSuccess();
      router.refresh();
    }
  }, [afterSuccess, router, state.status]);

  const Content = (
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
              doAction({
                reviewId: reviewId,
                bookId: bookId,
              });
            });
          }}
        >
          {isPending ? 'Usuwanie...' : 'Usuń'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );

  if (onlyContent) {
    return Content;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {Content}
    </Dialog>
  );
};

export default DeleteReviewDialog;
