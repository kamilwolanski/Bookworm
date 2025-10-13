'use server';

import {
  removeBookFromShelf,
  addBookToShelfWithReview,
  addBookToShelf,
  changeBookStatus,
  upsertReviewVote,
  VoteActionResult,
} from '@/lib/userbooks';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { revalidatePath, revalidateTag } from 'next/cache';
import type { ActionResult } from '@/types/actions';
import { findUniqueBook, updateBookRating } from '@/lib/books';
import {
  parseFormAddBookToShelfData,
  parseFormEditionBookRateData,
} from '@/lib/parsers/books';
import { ReadingStatus, ReviewVoteType, UserBook } from '@prisma/client';

type VoteActionPayload = {
  reviewId: string;
  bookSlug: string;
  editionId: string;
  type: ReviewVoteType;
};

export const rateBookAction = async (
  bookId: string,
  bookSlug: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  const parsed = parseFormEditionBookRateData(formData);
  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const { body, rating, editionId } = parsed.data;

  const bookExists = await findUniqueBook(bookId);
  if (!bookExists) return notFoundResponse(`książki o id: ${bookId}`);

  try {
    const result = await updateBookRating(session.user.id, {
      bookId,
      editionId,
      rating,
      body,
    });

    revalidateTag(`reviews:${bookSlug}`);

    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
};

export const addBookToShelfAction = async (
  bookId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  const parsed = parseFormAddBookToShelfData(formData);

  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const { editionId, readingStatus, body, rating } = parsed.data;

  try {
    const result = await addBookToShelfWithReview(session.user.id, {
      bookId,
      editionId,
      readingStatus,
      body,
      rating,
    });

    revalidatePath(`/books`);
    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
};

export const addBookToShelfBasicAction = async ({
  bookId,
  bookSlug,
  editionId,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
}): Promise<ActionResult<UserBook>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await addBookToShelf(session.user.id, {
      bookId: bookId,
      editionId: editionId,
    });

    revalidatePath(`/books/${bookSlug}/${editionId}`);
    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
};

export const changeBookStatusAction = async ({
  bookId,
  bookSlug,
  editionId,
  readingStatus,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  readingStatus: ReadingStatus;
}): Promise<ActionResult<UserBook>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await changeBookStatus(session.user.id, {
      bookId: bookId,
      editionId: editionId,
      readingStatus,
    });

    revalidatePath(`/books/${bookSlug}/${editionId}`);
    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
};

export const removeBookFromShelfAction = async ({
  bookId,
  bookSlug,
  editionId,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
}): Promise<ActionResult<void>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await removeBookFromShelf(session.user.id, {
      bookId,
      editionId,
    });

    revalidatePath(`/books/${bookSlug}/${editionId}`);
    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
};

export const addRatingAction = async ({
  bookId,
  bookSlug,
  editionId,
  rating,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  rating: number;
}): Promise<ActionResult> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await updateBookRating(session.user.id, {
      bookId,
      editionId,
      rating,
    });

    revalidateTag(`reviews:${bookSlug}`);

    // revalidatePath(`/books/${bookSlug}/${editionId}`);

    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
};

export const setReviewVoteAction = async ({
  reviewId,
  bookSlug,
  editionId,
  type,
}: VoteActionPayload): Promise<ActionResult<VoteActionResult>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await upsertReviewVote(session.user.id, { reviewId, type });
    revalidatePath(`/books/${bookSlug}/${editionId}`);

    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);

    return serverErrorResponse();
  }
};
