'use client';
import useSWR from 'swr';
import { ReviewItem } from '@/lib/reviews';

export const useReviews = (bookSlug: string, fallback: ReviewItem[]) => {
  const { data: reviews, isLoading } = useSWR<ReviewItem[]>(
    `/api/reviews/${bookSlug}`,
    null,
    { fallbackData: fallback, revalidateOnMount: false }
  );

  return { reviews: reviews ?? fallback, loading: isLoading };
};
