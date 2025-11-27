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
import AddBookForm from '@/components/book/addBookStepper/AddBookForm';
import { useState } from 'react';

const AddBookStepperDialog = ({
  bookId,
  bookSlug,
  editions,
  dialogTitle,
  onlyContent = false,
  otherEditionsMode = false,
  userEditions,
  afterSuccess,
}: {
  bookId: string;
  bookSlug: string;
  editions: EditionDto[];
  dialogTitle: string;
  onlyContent?: boolean;
  otherEditionsMode?: boolean;
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
      bg-background/95 backdrop-blur max-h-[85vh] overflow-y-scroll md:overflow-y-auto md:max-h-fit"
    >
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl font-semibold tracking-tight text-dialog-foreground px-8">
          {dialogTitle}
        </DialogTitle>
      </DialogHeader>

      <AddBookForm
        bookId={bookId}
        bookSlug={bookSlug}
        editions={editions}
        userEditions={userEditions}
        otherEditionsMode={otherEditionsMode}
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
        <button className="bg-badge-new text-secondary-foreground hover:bg-badge-new-hover px-3 py-1 rounded-2xl cursor-pointer ">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-medium">Dodaj</span>{' '}
            <Plus size={14} />
          </div>
        </button>
      </DialogTrigger>
      {Content}
    </Dialog>
  );
};

export default AddBookStepperDialog;
