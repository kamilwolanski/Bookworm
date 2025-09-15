import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import RateBookForm from '@/components/book/ratebook/RateBookForm';
import { ReactNode } from 'react';

export default function RatingDialogContent({
  bookId,
  editionId,
  dialogTitle,
  initialRating = 0,
  onSuccess,
}: {
  dialogTitle?: ReactNode;
  bookId: string;
  editionId: string;
  initialRating?: number;
  initialBody?: string;
  onSuccess?: () => void;
}) {
  return (
    <DialogContent
      className="
    sm:max-w-md p-6 rounded-2xl
    border border-border
    shadow-2xl
    bg-background/95 backdrop-blur
    supports-[backdrop-filter]:bg-background/80
    text-dialog-foreground 
  "
    >
      <DialogHeader className="space-y-1">
        <DialogTitle className="text-xl font-semibold tracking-tight text-dialog-foreground ">
          {dialogTitle}
        </DialogTitle>
        <DialogDescription className="text-sm text-dialog-foreground">
          Jak bardzo spodobała Ci się ta książka?
        </DialogDescription>
      </DialogHeader>
      <RateBookForm
        bookId={bookId}
        editionId={editionId}
        initialRating={initialRating}
        onSuccess={onSuccess}
      />
    </DialogContent>
  );
}
