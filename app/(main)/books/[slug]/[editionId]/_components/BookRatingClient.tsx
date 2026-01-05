"use client";

import { BookRatingResponse } from "@/lib/books/rating";
import useSWR from "swr";
import { StarRating} from "@/components/book/starRating/StarRating"

export default function BookRatingClient({
  bookSlug,
  bookRatingFromServer,
}: {
  bookSlug: string;
  bookRatingFromServer: BookRatingResponse;
}) {
  const {
    data: bookRating = bookRatingFromServer,
  } = useSWR<BookRatingResponse>(`/api/books/${bookSlug}/rating`, {
    fallbackData: bookRatingFromServer,
    revalidateOnMount: false,
  });

  return (
    <div className="flex items-center gap-2 mt-4">
      <StarRating rating={bookRating.averageRating ?? 0} />

      <span className="font-medium">{bookRating.averageRating}</span>
      <span className="text-muted-foreground">
        ({bookRating.ratingCount ?? 0} ocen)
      </span>
    </div>
  );
}
