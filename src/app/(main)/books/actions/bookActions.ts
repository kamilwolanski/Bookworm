'use server';

import {
  RemoveBookFromShelfPayload,
  removeBookFromShelf,
  addBookToShelfWithReview,
  addBookToShelf,
  changeBookStatus,
} from '@/lib/userbooks';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { Action, ActionResult } from '@/types/actions';
import { findUniqueBook, updateBookRating } from '@/lib/books';
import {
  parseFormAddBookToShelfData,
  parseFormEditionBookRateData,
} from '@/lib/parsers/books';
import { ReadingStatus, UserBook } from '@prisma/client';

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
