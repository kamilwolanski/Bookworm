'use server';

import {
  removeBookFromShelf,
  addBookToShelfWithReview,
  addBookToShelf,
  changeBookStatus,
} from '@/lib/userbooks';
import { serverErrorResponse, unauthorizedResponse } from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/types/actions';
import { parseFormAddBookToShelfData } from '@/lib/parsers/books';
import { ReadingStatus, UserBook } from '@prisma/client';

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
