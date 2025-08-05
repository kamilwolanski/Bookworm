import { CommentDto, GenreDTO } from './userbooks';
import prisma from './prisma';
import { Book, GenreSlug } from '@prisma/client';

export type BookDTO = Book & {
  genres?: GenreDTO[];
};

export type BookBasicDTO = Omit<
  Book,
  | 'averageRating'
  | 'ratingCount'
  | 'description'
  | 'pageCount'
  | 'publicationYear'
>;

export type CreateBookData = Omit<
  Book,
  'id' | 'addedAt' | 'averageRating' | 'ratingCount'
>;

export type BookDetailsDTO = Book & {
  genres?: GenreDTO[];
  comments: CommentDto[];
};

export async function getAllBooks(
  currentPage: number,
  booksPerPage: number,
  genres: GenreSlug[],
  ratings: string[],
  search?: string
): Promise<{
  books: BookDTO[];
  totalCount: number;
}> {
  const skip = (currentPage - 1) * booksPerPage;

  const searchConditions = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { author: { contains: search, mode: 'insensitive' as const } },
          {
            genres: {
              some: {
                genre: {
                  translations: {
                    some: {
                      language: 'pl',
                      name: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      }
    : {};

  const where = {
    ...searchConditions,
    ...(genres.length > 0 && {
      genres: {
        some: {
          genre: {
            slug: { in: genres },
          },
        },
      },
    }),
  };

  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      skip,
      take: booksPerPage,
      where,
      orderBy: { addedAt: 'desc' },
      include: {
        genres: {
          include: {
            genre: {
              include: {
                translations: {
                  where: { language: 'pl' },
                },
              },
            },
          },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  const booksDto: BookDTO[] = books.map((book) => ({
    ...book,
    genres: book.genres.map((g) => {
      const t = g.genre.translations[0];
      return {
        id: g.genre.id,
        slug: g.genre.slug,
        language: t.language,
        name: t.name,
      };
    }),
  }));

  return {
    books: booksDto,
    totalCount,
  };
}

export async function getAllBooksBasic(
  currentPage: number,
  booksPerPage: number,
  genres: GenreSlug[],
  ratings: string[],
  search?: string
): Promise<{
  books: BookBasicDTO[];
  totalCount: number;
}> {
  const skip = (currentPage - 1) * booksPerPage;

  const searchConditions = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { author: { contains: search, mode: 'insensitive' as const } },
          {
            genres: {
              some: {
                genre: {
                  translations: {
                    some: {
                      language: 'pl',
                      name: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      }
    : {};

  const where = {
    ...searchConditions,
    ...(genres.length > 0 && {
      genres: {
        some: {
          genre: {
            slug: { in: genres },
          },
        },
      },
    }),
  };

  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      skip,
      take: booksPerPage,
      where,
      orderBy: { addedAt: 'desc' },
      select: {
        id: true,
        title: true,
        author: true,
        addedAt: true,
        imageUrl: true,
        imagePublicId: true,
      },
    }),
    prisma.book.count({ where }),
  ]);

  const booksDto: BookBasicDTO[] = books.map((book) => ({
    ...book,
  }));

  return {
    books: booksDto,
    totalCount,
  };
}

export async function getBook(
  bookId: string,
  loggedUserId: string
): Promise<BookDetailsDTO> {
  const book = await prisma.book.findFirstOrThrow({
    where: { id: bookId },
    include: {
      genres: {
        include: {
          genre: {
            include: {
              translations: { where: { language: 'pl' } },
            },
          },
        },
      },
      comments: {
        include: {
          author: true,
          ratings: {
            select: {
              value: true,
              userId: true,
            },
          },
          replies: {
            include: {
              author: true,
              ratings: {
                select: {
                  value: true,
                  userId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const commentsWithScores = book.comments.map((comment) => {
    const totalScore = comment.ratings.reduce((sum, r) => sum + r.value, 0);

    const userRating =
      comment.ratings.find((r) => r.userId === loggedUserId)?.value ?? null;

    const replies = comment.replies.map((reply) => {
      const replyScore = reply.ratings.reduce((sum, r) => sum + r.value, 0);
      const replyUserRating =
        reply.ratings.find((r) => r.userId === loggedUserId)?.value ?? null;

      return {
        ...reply,
        totalScore: replyScore,
        userRating: replyUserRating,
        replies: [],
      };
    });

    return {
      ...comment,
      totalScore,
      userRating, // <- to będzie np. 1, -1, lub null jeśli brak
      replies,
    };
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

  const enrichedBook = {
    ...book,
    genres: genresDto,
    comments: commentsWithScores,
  };

  return enrichedBook;
}

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

export async function deleteBook(bookId: string) {
  const book = await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return book;
}
