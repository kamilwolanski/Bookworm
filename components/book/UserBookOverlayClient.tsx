"use client";

import { EditionUserResponseItem } from "@/lib/user";
import AddBookStepperDialog from "@/components/book/addBookStepper/AddBookStepperDialog";
import { BookCardDTO } from "@/lib/books";
import BookContextMenu from "./BookContextMenu";
import useSWR from "swr";
import { useState } from "react";

type UserBookOverlayClientProps = {
  editionUserResponseFromServer: EditionUserResponseItem;
  representativeEditionId: string;
  book: BookCardDTO["book"];
  representativeEditionTitle: string;
};

export default function UserBookOverlayClient({
  editionUserResponseFromServer,
  representativeEditionId,
  book,
  representativeEditionTitle,
}: UserBookOverlayClientProps) {
  const [open, setOpen] = useState(false);

  const { data: editionUserResponse = editionUserResponseFromServer } =
    useSWR<EditionUserResponseItem>(
      `/api/me/editions/${representativeEditionId}/userBooks`,
      {
        fallbackData: editionUserResponseFromServer,
        revalidateOnMount: false,
      }
    );
  const userState = editionUserResponse.userState;

  const onShelf = userState.userEditions.length > 0 ? true : false;

  const hasOtherEdition =
    userState.userEditions.findIndex(
      (edition) => edition.editionId === representativeEditionId
    ) === -1;
  return (
    <>
      {onShelf ? (
        hasOtherEdition ? (
          <div className="bg-badge-other-edition text-primary-foreground px-3 py-1 rounded-2xl">
            <span className="text-xs sm:text-sm font-medium">
              Masz inne wydanie
            </span>
          </div>
        ) : (
          <div className="px-3 py-1 rounded-2xl bg-badge-owned text-primary border border-badge-owned-border">
            <span className="text-xs sm:text-sm font-medium">Na półce</span>
          </div>
        )
      ) : null}

      <AddBookStepperDialog
        bookId={book.id}
        isOpen={open}
        onOpenChange={setOpen}
        bookSlug={book.slug}
        editions={book.editions}
        dialogTitle={`${representativeEditionTitle} - ${book.authors
          .map((a) => a.name)
          .join(", ")}`}
        userEditions={userState.userEditions}
        isOwned={onShelf}
      />

      <BookContextMenu
        logIn={true}
        book={book}
        onShelf={onShelf}
        userEditions={userState.userEditions}
        representativeEditionTitle={representativeEditionTitle}
      />
    </>
  );
}
