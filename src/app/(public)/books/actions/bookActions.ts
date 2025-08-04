'use server';

import {
  BookDetailsDTO,
  BookDTO,
  createBook,
  CreateBookData,
  getAllBooks,
  getBook,
} from '@/lib/books';
import { notFoundResponse, serverErrorResponse } from '@/lib/responses';
import { Action } from '@/types/actions';
import { GenreSlug, Prisma } from '@prisma/client';
import { handleImageUpload, parseFormData } from '@/app/(user)/shelf/helpers';
import { revalidatePath } from 'next/cache';
import { getUserSession } from '@/lib/session';
import { v2 as cloudinary } from 'cloudinary';

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
    books: BookDTO[];
    totalCount: number;
  }
> = async ({ currentPage, booksPerPage = 10, search, genres, ratings }) => {
  try {
    const books = await getAllBooks(
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
    const uploadResult = await handleImageUpload(file);
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

  revalidatePath('/books');

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

  // revalidatePath('/books');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została usunięta',
  };
};
