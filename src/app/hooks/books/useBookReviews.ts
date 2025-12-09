'use client';
import { useMemo } from 'react';
import { ReviewItem } from '@/lib/reviews';
import { useReviews } from './reviews/useReviews';
import { useReviewVotes } from './reviews/useReviewVotes';
import { useUserVotes } from '../user/reviews/useUserVotes';

export const useBookReviews = (args: {
  bookSlug: string;
  initialReviews: ReviewItem[];
  sessionUserId?: string | null;
}) => {
  const { bookSlug, initialReviews, sessionUserId } = args;

  const { reviews } = useReviews(bookSlug, initialReviews);

  const reviewIds = useMemo(() => reviews.map((r) => r.id), [reviews]);

  const { votesMap, swrVotesKey } = useReviewVotes(reviewIds);

  const userReview = useMemo(
    () =>
      sessionUserId
        ? reviews.find((r) => String(r.user?.id) === String(sessionUserId))
        : undefined,
    [sessionUserId, reviews]
  );

  const otherReviews = useMemo(
    () => reviews.filter((r) => r.id !== userReview?.id),
    [reviews, userReview?.id]
  );
  const otherIds = useMemo(() => otherReviews.map((r) => r.id), [otherReviews]);

  const { userVotesMap, swrUserVotesKey } = useUserVotes(
    sessionUserId,
    otherIds
  );

  return {
    reviews,
    userReview,
    otherReviews,
    votesMap,
    userVotesMap,
    swrVotesKey,
    swrUserVotesKey,
  };
};
