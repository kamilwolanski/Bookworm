'use client';
import useSWR from 'swr';

import { UserBookReview } from '@/lib/user';

export const useUserReview = (bookId: string, editionId: string) => {
  const { data: userReview, isLoading } = useSWR<UserBookReview[]>(
    `/api/user/reviews/${bookId}/${editionId}`
  );

  return { x: userReview, loading: isLoading };
};
