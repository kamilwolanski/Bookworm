'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ReactNode, useState } from 'react';
import RateBookForm from './RateBookForm';

const RateBookDialog = ({
  bookId,
  bookSlug,
  editionId,
  dialogTitle,
  onlyContent = false,
  userReview,
  afterSuccess,
  children,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  dialogTitle: string;
  onlyContent?: boolean;
  userReview?: {
    editionId: string;
    rating: number | null;
    body: string | null;
  };
  afterSuccess?: () => void;
  children?: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);
  const Content = (
    <DialogContent
      className="sm:max-w-[625px] p-6 rounded-2xl
      border border-border
      shadow-2xl
      bg-background/95 backdrop-blur
   "
    >
      <DialogHeader>
        <DialogTitle className="text-xl tracking-tight text-dialog-foreground px-8">
          {dialogTitle}
        </DialogTitle>
      </DialogHeader>

      <RateBookForm
        bookId={bookId}
        bookSlug={bookSlug}
        editionId={editionId}
        userReview={userReview}
        afterSuccess={afterSuccess ? afterSuccess : closeDialog}
      />
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

export default RateBookDialog;
