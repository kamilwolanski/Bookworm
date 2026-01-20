'use client';
import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '@/app/services/fetcher';
import { UserBookReviewVote } from '@/lib/user';

export const useUserVotes = (
  userId: string | undefined | null,
  reviewIds: string[] = []
) => {
  const shouldFetch = Boolean(userId && reviewIds.length > 0);
  const key = useMemo(
    () => (shouldFetch ? ['/api/me/reviews/user-votes', reviewIds] : null),
    [shouldFetch, reviewIds]
  );

  const { data, isLoading } = useSWR<UserBookReviewVote[]>(
    key,
    ([url, ids]: [string, string[]]) =>
      fetcher<UserBookReviewVote[]>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds: ids }),
      })
  );

  const map = useMemo(
    () => new Map((data ?? []).map((v) => [v.reviewId, v])),
    [data]
  );

  return {
    userVotes: data ?? [],
    userVotesMap: map,
    loading: isLoading,
    swrUserVotesKey: key,
  };
};
