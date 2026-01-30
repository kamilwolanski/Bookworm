"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { BookPlus, MoreVertical, Star } from "lucide-react";
import LoginDialog from "../../auth/LoginDialog";
import RateBookStepperDialog from "../ratebook/RateBookStepperDialog";
import { BookCardDTO } from "@/lib/books";
import AddBookStepperDialog from "../addBookStepper/AddBookStepperDialog";
import { UserEditionDto } from "@/lib/user";

function BookContextMenu({
  logIn,
  book,
  onShelf,
  userEditions,
  representativeEditionTitle,
}: {
  logIn: boolean;
  book: BookCardDTO["book"];
  onShelf: boolean;
  userEditions: UserEditionDto[];
  representativeEditionTitle: string;
}) {
  const [dialogType, setDialogType] = useState<
    null | "delete" | "rate" | "showOtherEditions" | "login"
  >(null);

  return (
    <>
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild className="w-8">
            <button
              type="button"
              className="bg-card-menu-trigger hover:bg-card-menu-trigger-hover rounded-full w-7! h-7! flex items-center justify-center cursor-pointer"
              aria-label="Więcej akcji"
            >
              <MoreVertical className="text-popover-foreground" size={17} />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem
              className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
              onClick={() => setDialogType("showOtherEditions")}
            >
              <BookPlus className="w-4 h-4" />
              Wszystkie wydania
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {logIn ? (
              <DropdownMenuItem
                className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                onClick={() => setDialogType("rate")}
              >
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                Oceń
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                onClick={() => setDialogType("login")}
              >
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                Oceń
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <RateBookStepperDialog
        bookId={book.id}
        bookSlug={book.slug}
        isOpen={dialogType === "rate"}
        onOpenChange={(o) => !o && setDialogType(null)}
        afterSuccess={() => setDialogType(null)}
        dialogTitle="Oceń książkę"
        editions={book.editions}
        renderTrigger={false}
      />

      <AddBookStepperDialog
        bookId={book.id}
        isOwned={onShelf}
        bookSlug={book.slug}
        editions={book.editions}
        dialogTitle={`${representativeEditionTitle} - ${book.authors
          .map((a) => a.name)
          .join(", ")}`}
        userEditions={userEditions}
        otherEditionsMode
        afterSuccess={() => setDialogType(null)}
        isOpen={dialogType === "showOtherEditions"}
        onOpenChange={(o) => !o && setDialogType(null)}
        renderTrigger={false}
      />

      <LoginDialog
        isOpen={dialogType === "login"}
        onOpenChange={(o) => !o && setDialogType(null)}
      />
    </>
  );
}

export default BookContextMenu;
export { BookContextMenu };
