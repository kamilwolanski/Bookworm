"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import RateBookStepperForm from "@/components/book/ratebook/RateBookStepperForm";
import { EditionDto } from "@/lib/books";
import { UserEditionDto } from "@/lib/user";

const RateBookStepperDialog = ({
  bookId,
  bookSlug,
  editions,
  dialogTitle,
  showSteps = true,
  userEditions = [],
  afterSuccess,
  isOpen,
  onOpenChange,
  renderTrigger = true,
}: {
  bookId: string;
  bookSlug: string;
  editions: EditionDto[];
  dialogTitle: string;
  showSteps?: boolean;
  userEditions?: UserEditionDto[];
  afterSuccess?: () => void;
  isOpen?: boolean;
  onOpenChange?: (o: boolean) => void;
  renderTrigger?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);
  const Content = (
    <DialogContent
      className="sm:max-w-156.25 p-6 rounded-2xl
      border border-border
      shadow-2xl
      bg-background/95 backdrop-blur "
    >
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl font-semibold tracking-tight text-dialog-foreground px-8">
          {dialogTitle}
        </DialogTitle>
      </DialogHeader>

      <RateBookStepperForm
        bookId={bookId}
        bookSlug={bookSlug}
        editions={editions}
        userEditions={userEditions}
        showSteps={showSteps}
        afterSuccess={afterSuccess ? afterSuccess : closeDialog}
      />
    </DialogContent>
  );

  return (
    <Dialog
      open={isOpen ?? open}
      onOpenChange={onOpenChange ? onOpenChange : setOpen}
    >
      {renderTrigger && (
        <DialogTrigger asChild>
          <button className="bg-badge-new text-secondary-foreground px-3 py-1 rounded-2xl cursor-pointer hover:bg-badge-new-hover">
            <div className="flex items-center gap-2">
              <span className="text-sm">Oceń</span> <Plus size={16} />
            </div>
          </button>
        </DialogTrigger>
      )}
      {Content}
    </Dialog>
  );
};

export default RateBookStepperDialog;
