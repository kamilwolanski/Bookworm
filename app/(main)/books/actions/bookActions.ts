'use server';

import { addBookToShelfWithReview } from '@/lib/userbooks';
import { serverErrorResponse, unauthorizedResponse } from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import type { ActionResult } from '@/types/actions';
import { parseFormAddBookToShelfData } from '@/lib/parsers/books';
import { ReadingStatus, UserBook } from '@prisma/client';
import {
  addBookToShelf,
  changeBookStatus,
  removeBookFromShelf,
} from '@/lib/user';

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
  editionId,
}: {
  bookId: string;
  editionId: string;
}): Promise<ActionResult<UserBook>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await addBookToShelf(session.user.id, {
      bookId: bookId,
      editionId: editionId,
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

export const changeBookStatusAction = async ({
  bookId,
  editionId,
  readingStatus,
}: {
  bookId: string;
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
  editionId,
}: {
  bookId: string;
  editionId: string;
}): Promise<ActionResult<void>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await removeBookFromShelf(session.user.id, {
      bookId,
      editionId,
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
