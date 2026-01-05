"use client";
import useSWR from "swr";
import { GetBookReviewsResult } from "@/lib/reviews";

export const getReviewsKey = (bookSlug: string, page: number) => {
  if (typeof window === "undefined") return null;
  const url = new URL(`/api/reviews/${bookSlug}`, window.location.origin);

  if (page) {
    url.searchParams.set("page", String(page));
  }

  return url.toString();
};

export const useReviews = (bookSlug: string, page: number, fallbackData: GetBookReviewsResult) => {
  const key = getReviewsKey(bookSlug, page);

  const { data: reviews, isLoading } = useSWR<GetBookReviewsResult>(key, {
    fallbackData: fallbackData,
  });

  return {
    reviews: reviews?.items,
    paginationData: {
      total: reviews?.total,
      page: reviews?.page,
      pageSize: reviews?.pageSize,
    },
    loading: isLoading,
  };
};
