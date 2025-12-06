// lib/reviews/types.ts
import { MediaFormat, Review, ReviewVoteType } from '@prisma/client';

export type VoteStateDeprecated = {
  myVote?: ReviewVoteType | null;
  likes: number;
  dislikes: number;
};

export type ReviewItemDeprecated = Review & {
  user: { id: string; name: string | null; image: string | null };
  edition: {
    id: string;
    language: string | null;
    format: MediaFormat | null;
  };
  isOwner: boolean;
  votes: VoteState;
};

export type VoteState = {
  likes: number;
  dislikes: number;
};

export type ReviewItem = {
  id: string;
  editionId: string;
  rating: number | null;
  body: string | null;
  createdAt: Date;
  user: { id: string; name: string | null; image: string | null };
  votes: VoteState;
};

export type GetBookReviewsResult = {
  items: Array<ReviewItem>;
  total: number;
  page: number;
  pageSize: number;
};

export type GetBookReviewsOptions = {
  page?: number;
  pageSize?: number;
  onlyWithContent?: boolean;
};

export type RatePayload = {
  bookId: string;
  editionId: string;
  rating?: number;
  body?: string;
};

export type DeleteReviewPayload = { reviewId: string; bookId: string };
