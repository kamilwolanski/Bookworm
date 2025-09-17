'use server';

import { BookDetailsDTO, getBook } from '@/lib/books';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { Action, ActionResult } from '@/types/actions';
import { Prisma, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getUserSession } from '@/lib/session';
import { v2 as cloudinary } from 'cloudinary';
import { deleteBook } from '@/lib/adminBooks';
import slugify from 'slugify';
import {
  createBook,
  CreateBookInput,
  updateBook,
  UpdateBookData,
} from '@/lib/adminBooks';
import { parseFormBookData } from '@/lib/parsers/books';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const getBookAction: Action<[string], BookDetailsDTO> = async (
  bookId
) => {
  const session = await getUserSession();
  const book = await getBook(bookId, session.user.id);

  if (!book) return notFoundResponse(`Nie znaleziono książki o id: ${bookId}`);

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    data: book,
  };
};

export const createBookAction: Action<[unknown, FormData]> = async (
  currentState,
  formData
) => {
  const session = await getUserSession();

  if (session.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const parsed = parseFormBookData(formData);
  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const { title, authors, genres, firstPublicationDate } = parsed.data;

  const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@,]/g });

  const data: CreateBookInput = {
    title,
    slug,
    authorIds: authors,
    firstPublicationDate: firstPublicationDate ?? null,
    genreIds: genres,
  };

  try {
    await createBook(data);
  } catch (error) {
    console.error('Create book error:', error);
    return serverErrorResponse();
  }

  revalidatePath('/admin/books');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została dodana',
  };
};

export const updateBookAction = async (
  bookId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getUserSession();

  if (session.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const parsed = parseFormBookData(formData);
  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const { title, authors, genres, firstPublicationDate } = parsed.data;

  const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@,]/g });

  const data: UpdateBookData = {
    id: bookId,
    title,
    slug,
    authorIds: authors,
    firstPublicationDate: firstPublicationDate ?? null,
    genreIds: genres,
  };

  try {
    await updateBook(data);
  } catch (error) {
    console.error('Update book error:', error);
    return serverErrorResponse();
  }

  revalidatePath('/admin/books');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została zaktualizowana',
  };
};

export const deleteBookAction: Action<[unknown, string]> = async (
  _,
  bookId
) => {
  const session = await getUserSession();

  if (session.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  try {
    await deleteBook(bookId);
  } catch (e) {
    console.error('Delete error:', e);

    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return notFoundResponse(`Książka o id: ${bookId} już nie istnieje`);
    }

    return {
      isError: true,
      status: 'server_error',
      httpStatus: 500,
      message: 'Wystąpił błąd serwera',
    };
  }

  revalidatePath('/admin/books');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została usunięta',
  };
};
