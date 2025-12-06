import { ReviewVoteType } from '@prisma/client';

export type UserReviewData = {
  id: string;
  userId: string;
  votes: {
    type: ReviewVoteType;
  }[];
};

export type UserBookReview = {
  editionId: string;
  rating: number | null;
  body: string | null;
};
