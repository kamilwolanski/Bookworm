"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useEffect } from "react";
import { UserEditionDto } from "@/lib/user";
import { Publisher } from "@prisma/client";
import AddBookForm from "./AddBookForm";
import { preload } from "swr";
import { fetcher } from "@/app/services/fetcher";

export type EditionDto = {
  id: string;
  language: string | null;
  publicationDate: Date | null;
  title: string | null;
  subtitle: string | null;
  coverUrl: string | null;
  publishers: {
    editionId: string;
    order: number | null;
    publisher: Publisher;
    publisherId: string;
  }[];
};
const AddBookStepperDialog = ({
  bookId,
  isOwned,
  bookSlug,
  editions,
  dialogTitle,
  otherEditionsMode = false,
  userEditions,
  afterSuccess,
  isOpen,
  onOpenChange,
  renderTrigger = true,
}: {
  bookId: string;
  isOwned: boolean;
  bookSlug: string;
  editions: EditionDto[];
  dialogTitle: string;
  otherEditionsMode?: boolean;
  userEditions: UserEditionDto[];
  afterSuccess?: () => void;
  onOpenChange: (o: boolean) => void;
  isOpen: boolean;
  renderTrigger?: boolean;
}) => {

  const closeDialog = () => onOpenChange(false)

  useEffect(() => {
    return () => onOpenChange(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const Content = (
    <DialogContent
      className="sm:max-w-156.25 p-6 rounded-2xl
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


  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      {!isOwned && renderTrigger && (
        <DialogTrigger asChild>
          <button
            className="bg-badge-new text-secondary-foreground hover:bg-badge-new-hover px-3 py-1 rounded-2xl cursor-pointer"
            onMouseEnter={() => preload(`/api/me/books/${bookSlug}/reviews`, fetcher)}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium">Dodaj</span>
              <Plus size={14} />
            </div>
          </button>
        </DialogTrigger>
      )}
      {Content}
    </Dialog>
  );
};

export default AddBookStepperDialog;
