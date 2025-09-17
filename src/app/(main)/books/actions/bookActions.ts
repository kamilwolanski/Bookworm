'use server';

import {
  UserBookDetailsDTO,
  getBook,
  RemoveBookFromShelfPayload,
  removeBookFromShelf,
  addBookToShelfWithReview,
} from '@/lib/userbooks';
import {
  forbiddenResponse,
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

export const getBookAction: Action<[string], UserBookDetailsDTO> = async (
  bookId
) => {
  const session = await getUserSession();

  if (!session?.user?.id) return unauthorizedResponse();

  const book = await getBook(bookId, session.user.id);

  if (!book) return notFoundResponse(`Nie znaleziono książki o id: ${bookId}`);

  if (book.userId !== session.user.id)
    return forbiddenResponse('Brak dostępu do tej książki');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    data: book,
  };
};

export const rateBookAction = async (
  bookId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> => {
  console.log('weszlo');
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
  console.log('weszlo action');
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
    console.log('result', result);
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

export const removeBookFromShelfAction: Action<
  [ActionResult<void>, RemoveBookFromShelfPayload],
  void
> = async (_prev, { bookId, editionId }) => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await removeBookFromShelf(session.user.id, {
      bookId,
      editionId,
    });
    console.log('result', result);
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
