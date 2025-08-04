'use server';

import {
  BookDetailsDTO,
  BookDTO,
  getAllBooks,
  getBook,
} from '@/lib/books';
import { notFoundResponse, serverErrorResponse } from '@/lib/responses';
import { Action } from '@/types/actions';
import { GenreSlug } from '@prisma/client';
import { getUserSession } from '@/lib/session';
import { v2 as cloudinary } from 'cloudinary';

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
