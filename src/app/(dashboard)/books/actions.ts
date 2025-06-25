'use server';

import {
  BookDTO,
  createBook,
  CreateBookData,
  deleteBook,
  EditBookData,
  getBook,
  updateBookWithTransaction,
} from '@/lib/books';
import { getUserSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { Action } from '@/types/actions';
import { v2 as cloudinary } from 'cloudinary';
import { Prisma } from '@prisma/client';
import {
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { handleImageUpload, parseFormData } from './helpers';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const addBookAction: Action<[unknown, FormData]> = async (
  currentState,
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

  const {
    title,
    author,
    file,
    genres,
    pageCount,
    publicationYear,
    readingStatus,
    rating,
    description,
  } = parsed.data;

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (file && file.size > 0) {
    const uploadResult = await handleImageUpload(file);
    if (uploadResult.isError) return uploadResult;

    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.imagePublicId;
  }

  const data: CreateBookData = {
    title,
    author,
    userId: session.user.id,
    description: description ?? null,
    pageCount: pageCount ?? null,
    publicationYear: publicationYear ?? null,
    readingStatus,
    rating: rating ?? null,
    imageUrl,
    imagePublicId,
  };

  try {
    await createBook(data, genres);
  } catch (error) {
    console.error('Create book error:', error);
    return serverErrorResponse();
  }

  revalidatePath('/dashboard');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została dodana',
  };
};

export const removeBookAction: Action<[unknown, string]> = async (
  _,
  bookId
) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return unauthorizedResponse();
  }

  const book = await getBook(bookId);

  if (!book) return notFoundResponse(`Nie znaleziono książki o id: ${bookId}`);

  if (book.userId !== session.user.id)
    return forbiddenResponse(
      `Brak uprawnień do usunięcia książki o id: ${bookId}`
    );

  try {
    if (book.imagePublicId) {
      const result = await cloudinary.uploader.destroy(book.imagePublicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        return {
          isError: true,
          status: 'cloudinary_error',
          httpStatus: 500,
          message: 'Nie udało się usunąć pliku z Cloudinary.',
        };
      }
    }

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

  revalidatePath('/dashboard');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została usunięta',
  };
};

export const getBookAction: Action<[string], BookDTO> = async (bookId) => {
  const session = await getUserSession();

  if (!session?.user?.id) return unauthorizedResponse();

  const book = await getBook(bookId);

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
    const uploadResult = await handleImageUpload(file, existingImagePublicId);
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
