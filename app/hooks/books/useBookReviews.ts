"use client";
import { useMemo } from "react";
import { useReviews } from "./reviews/useReviews";
import { useUserVotes } from "../user/reviews/useUserVotes";
import { useUserReview } from "../user/reviews/useUserReview";
import { GetBookReviewsResult } from "@/lib/reviews";
import { UserBookReview } from "@/lib/user";

export const useBookReviews = (args: {
  editionId: string;
  bookSlug: string;
  userId: string | undefined;
  page: number;
  reviewsResultFromServer: GetBookReviewsResult;
  userBookReviewFromServer: UserBookReview | null;
}) => {
  const {
    bookSlug,
    editionId,
    userId,
    page,
    reviewsResultFromServer,
    userBookReviewFromServer,
  } = args;

  const { reviews, paginationData } = useReviews(
    bookSlug,
    page,
    reviewsResultFromServer
  );
  const { userEditionReview } = useUserReview(
    editionId,
    userBookReviewFromServer
  );

  const userReviews = useMemo(
    () =>
      userId
        ? reviews?.filter((r) => String(r.user?.id) === String(userId))
        : undefined,
    [userId, reviews]
  );

  const otherReviews = useMemo(
    () =>
      reviews?.filter(
        (r) => !userReviews?.map((review) => review.id).includes(r.id)
      ),
    [reviews, userReviews]
  );
  const otherIds = useMemo(
    () => otherReviews?.map((r) => r.id),
    [otherReviews]
  );

  const { userVotesMap, swrUserVotesKey, loading: loadingUserVotes } = useUserVotes(userId, otherIds);

  return {
    reviews,
    paginationData,
    userReviews,
    otherReviews,
    userVotesMap,
    swrUserVotesKey,
    userEditionReview,
    loadingUserVotes
  };
};
