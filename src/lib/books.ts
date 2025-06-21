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

export type BookDTO = Book & { genres?: GenreDTO[] };

export async function createBook(data: CreateBookData, genreIds: string[]) {
  if (genreIds?.length > 0) {
    return await prisma.book.create({
      data: {
        ...data,
        genres: {
          create: genreIds?.map((genreId) => ({
            genre: {
              connect: { id: genreId },
            },
          })),
        },
      },
    });
  } else {
    return await prisma.book.create({ data });
  }
}
export async function getBooks() {
  const session = await getUserSession();
  const books = await prisma.book.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      genres: {
        include: {
          genre: {
            include: {
              translations: {
                where: {
                  language: 'pl',
                },
              },
            },
          },
        },
      },
    },
  });

  const booksDto = books.map((book) => {
    const genresDto = book.genres.map((genre) => {
      const translation = genre.genre.translations[0];

      return {
        id: genre.genre.id,
        slug: genre.genre.slug,
        language: translation.language,
        name: translation.name,
      };
    });

    return {
      ...book,
      genres: genresDto,
    };
  });
  return booksDto;
}

export async function deleteBook(bookId: string) {
  const book = await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return book;
}

export async function getBook(bookId: string): Promise<BookDTO> {
  const book = await prisma.book.findFirstOrThrow({
    where: {
      id: bookId,
    },
    include: {
      genres: {
        include: {
          genre: {
            include: {
              translations: {
                where: {
                  language: 'pl',
                },
              },
            },
          },
        },
      },
    },
  });

  const genresDto: GenreDTO[] = book?.genres.map((genre) => {
    const translation = genre.genre.translations[0];

    return {
      id: genre.genre.id,
      slug: genre.genre.slug,
      language: translation.language,
      name: translation.name,
    };
  });

  return {
    ...book,
    genres: genresDto,
  };
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
