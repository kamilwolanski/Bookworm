import { CommentDto, GenreDTO } from './userbooks';
import prisma from '@/lib/prisma';
import { Book } from '@prisma/client';

export type BookDTO = Book & {
  genres?: GenreDTO[];
};

export type CreateBookData = Omit<
  Book,
  'id' | 'addedAt' | 'averageRating' | 'ratingCount'
>;

export type BookDetailsDTO = Book & {
  genres?: GenreDTO[];
  comments: CommentDto[];
};

export type RatePayload = {
  bookId: string;
  editionId: string;
  rating?: number;
  body?: string;
};

export type RateData = {
  averageRating: number;
  ratingCount: number;
  userRating: number;
};

export async function getAllBooks(
  currentPage: number,
  booksPerPage: number,
  genres: string[],
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

export async function deleteBook(bookId: string) {
  const book = await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return book;
}

export async function findUniqueBook(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true },
  });

  return book;
}

export async function updateBookRating(
  userId: string,
  { editionId, bookId, rating, body }: RatePayload
): Promise<void> {
  if (rating) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5.');
    }
  }

  return prisma.$transaction(async (tx) => {
    // Upsert oceny użytkownika
    await tx.review.upsert({
      where: {
        userId_editionId: { userId, editionId },
      },
      create: { editionId, userId, rating, body },
      update: { rating, body },
    });

    // Agregaty po zmianie
    const aggs = await tx.review.aggregate({
      where: { editionId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // Zaokrąglenie średniej do 2 miejsc (opcjonalnie)
    const avg = Number((aggs._avg.rating ?? 0).toFixed(2));
    const count = aggs._count.rating;

    // Zapis agregatów w tabeli Book
    await tx.book.update({
      where: { id: bookId },
      data: {
        averageRating: avg,
        ratingCount: count,
      },
    });
  });
}
