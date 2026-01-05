/* eslint-disable react-hooks/set-state-in-effect */
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import {
  deleteReviewAction,
  DeleteReviewActionPayload,
} from "@/app/(main)/books/actions/reviewActions";
import { useSWRConfig } from "swr";
import { getReviewsKey } from "./books/reviews/useReviews";

function allDefined<T>(obj: Partial<T>): obj is T {
  return Object.values(obj).every((v) => v !== undefined);
}

export function useDeleteReviewDialog(
  actionParameters: Omit<DeleteReviewActionPayload, "reviewId">,
  editionId: string,
  bookSlug: string,
  currentPage: number
): [
  isPending: boolean,
  handleDelete: () => Promise<void>,
  deleteReviewId: string | null,
  setDeleteReviewId: Dispatch<SetStateAction<string | null>>
] {
  const { mutate } = useSWRConfig();
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (deleteReviewId !== null) {
      setIsPending(false);
    }
  }, [deleteReviewId]);

  async function handleDelete() {
    if (!deleteReviewId) return;

    if (!allDefined(actionParameters)) {
      console.error("Missing parameters", actionParameters);
      return;
    }

    try {
      setIsPending(true);

      const result = await deleteReviewAction({
        reviewId: deleteReviewId,
        bookId: actionParameters.bookId,
      });

      if (result.status === "success") {
        await Promise.all([
          mutate(getReviewsKey(bookSlug, currentPage)),
          mutate(`/api/books/${bookSlug}/rating`),
          mutate(`/api/editions/${editionId}/reviews/me`),
        ]);
        setDeleteReviewId(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return [isPending, handleDelete, deleteReviewId, setDeleteReviewId];
}
