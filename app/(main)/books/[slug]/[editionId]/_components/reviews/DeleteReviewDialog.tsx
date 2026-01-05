'use client';

import { useState } from 'react';
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
import { ReactNode } from 'react';

const DeleteReviewDialog = ({
  dialogTitle,
  onlyContent = false,
  children,
  isPending,
  handleDelete,
}: {
  dialogTitle: string | ReactNode;
  onlyContent?: boolean;
  children?: ReactNode;
  isPending: boolean;
  handleDelete: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const Content = (
    <DialogContent
      className="
        sm:max-w-md p-6 rounded-2xl
    border border-border
    shadow-2xl
    bg-background/95 backdrop-blur
    supports-backdrop-filter:bg-background/80 
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
          onClick={handleDelete}
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
