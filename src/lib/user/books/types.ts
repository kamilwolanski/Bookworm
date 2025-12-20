import { ReadingStatus } from '@prisma/client';
import { UserBookReview } from '../reviews';

export type UserEditionData = {
  editionId: string;
  isOnShelf: boolean;
  readingStatus: ReadingStatus | null;
  userReview: UserBookReview | null;
  rating:
    | {
        averageRating: number | null;
        ratingCount: number | null;
      }
    | undefined;
};

export type RemoveBookFromShelfPayload = { bookId: string; editionId: string };

export type UserEditionDto = {
  editionId: string;
};

export type EditionUserState = {
  userRating: number | null | undefined;
  userEditions: UserEditionDto[];
};

export type EditionUserResponseItem = {
  id: string;
  bookId: string;
  rating?: {
    averageRating: number | null;
    ratingCount: number | null;
  };
  userState: EditionUserState;
};
