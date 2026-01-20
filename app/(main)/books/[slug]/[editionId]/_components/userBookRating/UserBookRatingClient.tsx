"use client";

import { UserBookReview } from "@/lib/user";
import useSWR, { useSWRConfig } from "swr";
import { StarRating } from "../../../../../../../components/book/starRating/StarRating";
import { useTransition } from "react";
import { addRatingAction } from "@/app/(main)/books/actions/reviewActions";
import { getReviewsKey } from "@/app/hooks/books/reviews/useReviews";
import { useSearchParams } from "next/navigation";

export default function UserBookRatingClient({
  bookId,
  bookSlug,
  editionId,
  userReviewFromServer,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  userReviewFromServer: UserBookReview | null;
}) {
  const { data: userReview, mutate } = useSWR<UserBookReview | null>(
    `/api/me/editions/${editionId}/reviews`,
    {
      fallbackData: userReviewFromServer,
    }
  );

  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const currentPage = parseInt(page || "1", 10);
  const [isPending, startTransition] = useTransition();
  const { mutate: globalMutate } = useSWRConfig();

  const handleOnClick = async (starNumber: number) => {
    if (!bookId || !editionId) return;

    mutate(
      (current) => {
        if (current) {
          return { ...current, rating: starNumber };
        }
        return { id: "1", rating: starNumber, body: "", editionId: editionId };
      },
      { revalidate: false }
    );

    startTransition(async () => {
      try {
        const res = await addRatingAction({
          bookId,
          editionId,
          rating: starNumber,
        });

        if (res.isError) {
          mutate();
        }

        if (res.status === "success") {
          if (bookSlug) {
            globalMutate(getReviewsKey(bookSlug, currentPage));
            globalMutate(`/api/books/${bookSlug}/rating`);
          }
        }
      } catch {
        mutate();
      }
    });
  };

  return (
    <StarRating
      rating={userReview?.rating ?? 0}
      isPending={isPending}
      onClick={handleOnClick}
      interactive
    />
  );
}
