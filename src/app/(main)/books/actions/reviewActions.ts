'use server';

import { findUniqueBook } from '@/lib/books';
import { parseFormEditionBookRateData } from '@/lib/parsers/books';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { deleteReview, updateBookRating } from '@/lib/reviews';
import { getUserSession } from '@/lib/session';
import { upsertReviewVote, VoteActionResult } from '@/lib/userbooks';
import { ActionResult } from '@/types/actions';
import { ReviewVoteType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

type DeleteReviewPayload = {
  reviewId: string;
  bookId: string;
};

type VoteActionPayload = {
  reviewId: string;
  editionId: string;
  bookSlug: string;
  type: ReviewVoteType;
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

    // revalidateTag(`reviews:${bookSlug}`);

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

export const rateBookAction = async (
  bookId: string,
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

export const deleteReviewAction = async (
  _state: ActionResult,
  { reviewId, bookId }: DeleteReviewPayload
): Promise<ActionResult<void>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await deleteReview(session.user.id, {
      reviewId,
      bookId,
    });

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
