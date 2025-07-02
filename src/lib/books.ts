import { Book, GenreSlug } from '@prisma/client';
import prisma from './prisma';

export type CreateBookData = Omit<Book, 'id' | 'addedAt'>;
export type EditBookData = Omit<
  CreateBookData,
  'imageUrl' | 'imagePublicId'
> & {
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export type GenreDTO = {
  id: string;
  slug: GenreSlug;
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
export async function getBooks(
  userId: string,
  currentPage: number,
  booksPerPage: number
): Promise<{
  books: BookDTO[];
  totalCount: number;
}> {
  const skip = (currentPage - 1) * booksPerPage;

  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      skip,
      take: booksPerPage,
      where: {
        userId: userId,
      },
      orderBy: {
        addedAt: 'desc',
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
    }),
    prisma.book.count(),
  ]);

  console.log('totalCount', totalCount);
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

  return {
    books: booksDto,
    totalCount,
  };
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

export async function updateBookWithTransaction(
  bookId: string,
  data: EditBookData,
  genreIds: string[]
) {
  const updatedBook = await prisma.$transaction(async (tx) => {
    // 1. Usuń stare przypisania gatunków
    await tx.bookGenre.deleteMany({
      where: { bookId },
    });

    // 2. Zaktualizuj książkę i dodaj nowe gatunki
    return await tx.book.update({
      where: { id: bookId },
      data: {
        ...data,
        genres: {
          create: genreIds.map((genreId) => ({
            genre: {
              connect: { id: genreId },
            },
          })),
        },
      },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
  });

  return updatedBook;
}
