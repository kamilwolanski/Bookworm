'use client';
import useSWR from 'swr';
import { useMemo } from 'react';
import { fetcher } from '@/app/services/fetcher';
import { ReviewVotesCount } from '@/lib/reviews';

export const useReviewVotes = (reviewIds: string[] = []) => {
  const key = useMemo(() => ['/api/reviews/votes', reviewIds], [reviewIds]);

  const { data, isLoading } = useSWR<ReviewVotesCount[]>(
    key,
    ([url, ids]: [string, string[]]) =>
      fetcher<ReviewVotesCount[]>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewIds: ids,
        }),
      })
  );

  const votesMap = useMemo(
    () => new Map((data ?? []).map((v) => [v.reviewId, v])),
    [data]
  );

  return {
    votes: data ?? [],
    votesMap,
    loading: isLoading,
    swrVotesKey: key,
  };
};
