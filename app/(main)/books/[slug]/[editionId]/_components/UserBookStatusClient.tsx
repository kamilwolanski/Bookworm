'use client'

import { changeBookStatusAction } from "@/app/(main)/books/actions/bookActions";
import { UserBookStatus } from "@/lib/user";
import { ReadingStatus } from "@prisma/client";
import { useMemo, useTransition } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import useSWR from "swr";

export default function UserBookStatusClient({
  userBookStatusFromServer,
  bookSlug,
  bookId,
  editionId,
  isLogIn,
}: {
  userBookStatusFromServer: UserBookStatus | null;
  bookSlug: string;
  bookId: string;
  editionId: string;
  isLogIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const shouldFetch = isLogIn;
  const key = useMemo(
    () =>
      shouldFetch
        ? `/api/books/${bookSlug}/editions/${editionId}/userBook/me`
        : null,
    [bookSlug, editionId, shouldFetch],
  );
  const { data: userBookStatus = userBookStatusFromServer, mutate } =
    useSWR<UserBookStatus | null>(
      key,
      {
        fallbackData: userBookStatusFromServer,
      }
    );

  const changeStatus = (status: ReadingStatus) => {
    const prev = structuredClone(userBookStatus);

    mutate((current) => {
      if (current) {
        return { ...current, readingStatus: status };
      }
      return current;
    }, false);

    startTransition(async () => {
      try {
        const res = await changeBookStatusAction({
          bookId,
          editionId,
          readingStatus: status,
        });

        if (res.isError) {
          mutate(() => prev, false);
        }
      } catch {
        mutate(() => prev, false);
      }
    });
  };

  return (
    <>
      {userBookStatus?.isOnShelf && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Status Czytania
          </label>
          <Select
            value={userBookStatus.readingStatus ?? undefined}
            disabled={isPending}
            onValueChange={(value) => changeStatus(value as ReadingStatus)}
          >
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Wybierz status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WANT_TO_READ">Chcę przeczytać</SelectItem>
              <SelectItem value="READING">Obecnie czytam</SelectItem>
              <SelectItem value="READ">Przeczytane</SelectItem>
              <SelectItem value="ABANDONED">Porzucone</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
