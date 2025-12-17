'use client';
import { useMemo } from 'react';
import { useReviews } from './reviews/useReviews';
import { useReviewVotes } from './reviews/useReviewVotes';
import { useUserVotes } from '../user/reviews/useUserVotes';

export const useBookReviews = (args: {
  bookSlug: string;
  sessionUserId?: string | null;
  page: string | null;
}) => {
  const { bookSlug, sessionUserId, page } = args;

  const { reviews, paginationData, loading } = useReviews(bookSlug, page);

  const reviewIds = useMemo(
    () => (reviews ? reviews.map((r) => r.id) : []),
    [reviews]
  );

  const {
    votesMap,
    swrVotesKey,
    loading: loadingVotes,
  } = useReviewVotes(reviewIds);

  const userReviews = useMemo(
    () =>
      sessionUserId
        ? reviews?.filter((r) => String(r.user?.id) === String(sessionUserId))
        : undefined,
    [sessionUserId, reviews]
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

  const {
    userVotesMap,
    swrUserVotesKey,
    loading: loadingUserVotes,
  } = useUserVotes(sessionUserId, otherIds);

  const isLoading = loading || loadingVotes || loadingUserVotes;

  return {
    reviews,
    paginationData,
    userReviews,
    otherReviews,
    votesMap,
    userVotesMap,
    swrVotesKey,
    swrUserVotesKey,
    isLoading,
  };
};
