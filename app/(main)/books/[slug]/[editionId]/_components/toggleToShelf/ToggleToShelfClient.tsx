"use client";

import { Button } from "@/components/ui/button";
import { UserBookStatus } from "@/lib/user";
import { Minus, Plus } from "lucide-react";
import useSWR from "swr";
import { useTransition } from "react";
import {
  addBookToShelfBasicAction,
  removeBookFromShelfAction,
} from "@/app/(main)/books/actions/bookActions";

export default function UserBookSectionClient({
  userBookStatusFromServer,
  bookSlug,
  bookId,
  editionId,
}: {
  userBookStatusFromServer: UserBookStatus | null;
  bookSlug: string;
  bookId: string;
  editionId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const { data: userBookStatus = userBookStatusFromServer, mutate } =
    useSWR<UserBookStatus | null>(
      `/api/books/${bookSlug}/editions/${editionId}/userBook/me`,
      {
        fallbackData: userBookStatusFromServer,
      }
    );

  const handleToggle = async () => {
    if (userBookStatus?.isOnShelf) {
      const prev = structuredClone(userBookStatus);

      mutate((current) => {
        if (current) {
          return { ...current, isOnShelf: false, readingStatus: null };
        }

        return current;
      }, false);

      startTransition(async () => {
        try {
          const res = await removeBookFromShelfAction({
            bookId: bookId,
            editionId: editionId,
          });

          if (res.isError) {
            mutate(() => prev, false);
          }
        } catch {
          mutate(() => prev, false);
        }
      });
    } else {
      const prev = structuredClone(userBookStatus);

      mutate((current) => {
        if (current) {
          return { ...current, isOnShelf: true, readingStatus: "WANT_TO_READ" };
        }

        return current;
      }, false);

      startTransition(async () => {
        try {
          const res = await addBookToShelfBasicAction({
            bookId: bookId,
            editionId: editionId,
          });
          if (res.isError) {
            mutate(() => prev, false);
          }
        } catch {
          mutate(() => prev, false);
        }
      });
    }
  };

  return (
    <>
      <Button
        className="cursor-pointer bg-badge-new text-secondary-foreground hover:bg-badge-new-hover"
        onClick={handleToggle}
        disabled={isPending}
      >
        {userBookStatus?.isOnShelf ? (
          <>
            <Minus className="w-4 h-4 mr-1" />
            Usuń z półki
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-1" />
            Dodaj na półkę
          </>
        )}
      </Button>
    </>
  );
}
