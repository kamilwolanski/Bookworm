'use server';

import {
  UserBookDetailsDTO,
  EditBookData,
  getBook,
  getRecentBooksExcludingCurrent,
  RecentBookDto,
  updateBookWithTransaction,
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
import { handleImageUpload, parseFormData } from '@/app/admin/helpers';
import {
  findUniqueBook,
  RateData,
  RatePayload,
  updateBookRating,
} from '@/lib/books';

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

export const editBookAction: Action<[unknown, FormData]> = async (
  _,
  formData
) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return unauthorizedResponse();
  }

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return parsed.errorResponse;
  }

  if (!parsed.data.id) {
    return {
      isError: true,
      status: 'validation_error',
      httpStatus: 422,
      message: 'Brak ID książki',
    };
  }

  const {
    id,
    title,
    author,
    file,
    genres,
    pageCount,
    publicationYear,
    readingStatus,
    rating,
    description,
    imagePublicId: existingImagePublicId,
  } = parsed.data;

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (file && file.size > 0) {
    const uploadResult = await handleImageUpload(
      'BookCovers',
      file,
      existingImagePublicId
    );
    if (uploadResult.isError) return uploadResult;

    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.imagePublicId;
  }

  const updateData: EditBookData = {
    title,
    author,
    userId: session.user.id,
    description: description ?? null,
    pageCount: pageCount ?? null,
    publicationYear: publicationYear ?? null,
    readingStatus,
    rating: rating ?? null,
    ...(imageUrl && imagePublicId && { imageUrl, imagePublicId }),
  };

  if (!id) {
    return {
      isError: true,
      status: 'validation_error',
      httpStatus: 422,
      message: 'Brak id',
    };
  }

  try {
    await updateBookWithTransaction(id, updateData, genres);
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }

  revalidatePath(`/books/${id}`);

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została zaktualizowana',
  };
};

export const getRecentBooksAction: Action<
  [ActionResult<RecentBookDto[]>, string],
  RecentBookDto[]
> = async (_prev, currentBookId) => {
  const session = await getUserSession();

  if (!session?.user?.id) return unauthorizedResponse();

  const recentBooks = await getRecentBooksExcludingCurrent(
    session.user.id,
    currentBookId
  );

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    data: recentBooks,
  };
};

export const rateBookAction: Action<
  [ActionResult<RateData>, RatePayload],
  RateData
> = async (_prev, { bookId, rating }) => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  const bookExists = await findUniqueBook(bookId);
  if (!bookExists) return notFoundResponse(`książki o id: ${bookId}`);

  try {
    const result = await updateBookRating(session.user.id, { bookId, rating });
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
