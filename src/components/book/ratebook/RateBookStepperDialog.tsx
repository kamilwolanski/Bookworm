'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { EditionDto, UserEditionDto } from '@/lib/userbooks';
import { useState } from 'react';
import RateBookForm from '@/components/book/ratebook/RateBookForm';
import { Review } from '@prisma/client';

const RateBookStepperDialog = ({
  bookId,
  editions,
  dialogTitle,
  userReviews,
  onlyContent = false,
  showSteps = true,
  userEditions = [],
  afterSuccess,
}: {
  bookId: string;
  editions: EditionDto[];
  dialogTitle: string;
  userReviews?: Review[];
  onlyContent?: boolean;
  showSteps?: boolean;
  userEditions?: UserEditionDto[];
  afterSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);
  const Content = (
    <DialogContent
      className="sm:max-w-[625px] p-6 rounded-2xl
      border border-border
      shadow-2xl
      bg-background/95 backdrop-blur
      supports-[backdrop-filter]:bg-background/80 "
      data-no-nav="true"
    >
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold tracking-tight text-dialog-foreground">
          {dialogTitle}
        </DialogTitle>
      </DialogHeader>

      <RateBookForm
        bookId={bookId}
        editions={editions}
        userEditions={userEditions}
        showSteps={showSteps}
        userReviews={userReviews}
        afterSuccess={afterSuccess ? afterSuccess : closeDialog}
      />
    </DialogContent>
  );

  if (onlyContent) {
    return Content;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="bg-badge-new text-secondary-foreground px-3 py-1 rounded-2xl cursor-pointer hover:bg-badge-new-hover">
          <div className="flex items-center gap-2">
            <span className="text-sm">Oceń</span> <Plus size={16} />
          </div>
        </button>
      </DialogTrigger>
      {Content}
    </Dialog>
  );
};

export default RateBookStepperDialog;
