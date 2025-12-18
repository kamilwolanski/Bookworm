'use client';
import useSWR from 'swr';

import { UserBookReview } from '@/lib/user';

export const useUserReview = (bookId: string, editionId: string) => {
  const {
    data: userEditionReview,
    isLoading,
    mutate,
  } = useSWR<UserBookReview>(`/api/user/reviews/${bookId}/${editionId}`);

  return {
    userEditionReview: userEditionReview,
    loading: isLoading,
    userReviewMutate: mutate,
  };
};
