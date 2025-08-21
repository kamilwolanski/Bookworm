'use server';

import {
  BookDetailsDTO,
  BookBasicDTO,
  createBook,
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
import { GenreSlug, Prisma, Role } from '@prisma/client';
import { handleImageUpload, parseFormData } from '@/app/(main)/books/helpers';
import { revalidatePath } from 'next/cache';
import { getUserSession } from '@/lib/session';
import { v2 as cloudinary } from 'cloudinary';
import { deleteBook } from '@/lib/userbooks';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const getAllBooksAction: Action<
  [
    {
      currentPage: number;
      genres: GenreSlug[];
      ratings: string[];
      booksPerPage?: number;
      search?: string;
    },
  ],
  {
    books: BookBasicDTO[];
    totalCount: number;
  }
> = async ({ currentPage, booksPerPage = 10, search, genres, ratings }) => {
  try {
    const books = await getAllBooksBasic(
      currentPage,
      booksPerPage,
      genres,
      ratings,
      search
    );

    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: books,
    };
  } catch {
    return serverErrorResponse('Problem przy odczycie danych');
  }
};

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
    description,
  } = parsed.data;

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;

  if (file && file.size > 0) {
    const uploadResult = await handleImageUpload('BookCovers', file);
    if (uploadResult.isError) return uploadResult;

    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.imagePublicId;
  }

  const data: CreateBookData = {
    title,
    author,
    description: description ?? null,
    pageCount: pageCount ?? null,
    publicationYear: publicationYear ?? null,
    imageUrl,
    imagePublicId,
  };

  try {
    await createBook(data, genres);
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
