import { ReadingStatus } from '@prisma/client';

export type UserEditionData = {
  readingStatus: ReadingStatus;
  userRating: number | null;
} | null;

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
  userState: EditionUserState;
};
