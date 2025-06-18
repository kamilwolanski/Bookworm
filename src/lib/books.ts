import { Book } from '@prisma/client';
import prisma from './prisma';
import { getUserSession } from './session';

export type CreateBookData = Omit<Book, 'id' | 'addedAt'>;
export type GenreDTO = {
  id: string;
  slug: string;
  language: string;
  name: string;
};

export async function createBook(data: CreateBookData) {
  return prisma.book.create({ data });
}
export async function getBooks() {
  const session = await getUserSession();
  const books = prisma.book.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return books;
}

export async function deleteBook(bookId: string) {
  const book = await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return book;
}

export async function getBook(bookId: string) {
  const book = await prisma.book.findFirst({
    where: {
      id: bookId,
    },
  });

  return book;
}

export async function getBookGenres(
  language: 'pl' | 'en'
): Promise<GenreDTO[]> {
  const genres = await prisma.genre.findMany({
    include: {
      translations: {
        where: {
          language: language,
        },
        take: 1,
      },
    },
  });

  return genres.map((genre) => {
    const translation = genre.translations[0];

    return {
      id: genre.id,
      slug: genre.slug,
      language: translation.language,
      name: translation.name,
    };
  });
}
