'use server';

import {
  BookDetailsDTO,
  BookBasicDTO,
  CreateBookData,
  getAllBooksBasic,
  getBook,
  updateBookWithTransaction,
  EditBookData,
} from '@/lib/books';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { Action } from '@/types/actions';
import { Prisma, Role } from '@prisma/client';
import { handleImageUpload, parseFormData } from '@/app/(main)/books/helpers';
import { revalidatePath } from 'next/cache';
import { getUserSession } from '@/lib/session';
import { v2 as cloudinary } from 'cloudinary';
import { deleteBook } from '@/lib/userbooks';
import slugify from 'slugify';
import { createBook, CreateBookInput } from '@/lib/adminBooks';

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
  console.log('formData', formData.get('authors'))
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const { title, authors, genres, description, firstPublicationDate } =
    parsed.data;

  const slug = slugify(title, { lower: true });

  const data: CreateBookInput = {
    title,
    slug,
    authorIds: authors,
    description: description ?? null,
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

export const deleteBookAction: Action<[unknown, string]> = async (
  _,
  bookId
) => {
  const session = await getUserSession();

  if (session.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const book = await getBook(bookId, session.user.id);

  if (!book) return notFoundResponse(`Nie znaleziono książki o id: ${bookId}`);

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

  revalidatePath('/admin/books');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została usunięta',
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
    description: description ?? null,
    pageCount: pageCount ?? null,
    publicationYear: publicationYear ?? null,
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
