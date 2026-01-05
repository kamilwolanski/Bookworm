import { ReviewVoteType } from '@prisma/client';

export type UserReviewData = {
  id: string;
  userId: string;
  votes: {
    type: ReviewVoteType;
  }[];
};

export type UserBookReview = {
  id: string;
  editionId: string;
  rating: number | null;
  body: string | null;
};

export type UserBookReviewVote = {
  reviewId: string;
  type: ReviewVoteType | null;
};
