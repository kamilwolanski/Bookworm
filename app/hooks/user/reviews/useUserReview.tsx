"use client";
import useSWR from "swr";

import { UserBookReview } from "@/lib/user";

export const useUserReview = (
  editionId: string,
  userBookReviewFromServer: UserBookReview | null
) => {
  const {
    data: userEditionReview,
    isLoading,
    mutate,
  } = useSWR<UserBookReview | null>(
    `/api/me/editions/${editionId}/reviews`,
    {
      fallbackData: userBookReviewFromServer,
      revalidateOnMount: false
    }
  );

  return {
    userEditionReview: userEditionReview,
    loading: isLoading,
    userReviewMutate: mutate,
  };
};
