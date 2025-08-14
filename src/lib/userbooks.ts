import {
  Book,
  Comment,
  GenreSlug,
  ReadingStatus,
  User,
  UserBook,
} from '@prisma/client';
import prisma from './prisma';

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

export type UserBookDetailsDTO = Book &
  UserBook & {
    genres?: GenreDTO[];
    comments: CommentDto[];
  };

export type UserBookDTO = Book &
  UserBook & {
    genres?: GenreDTO[];
  };

export type RecentBookDto = {
  book: {
    id: string;
    title: string;
    imageUrl: string | null;
  };
};

export type CommentDto = Comment & {
  author: User;
  totalScore: number;
  userRating: number | null;
  ratings: {
    value: number;
    userId: string;
  }[];
  replies: CommentDto[];
};

interface AddCommentInput {
  content: string;
  authorId: string;
  bookId: string;
  parentId?: string;
}

interface AddRatingInput {
  commentId: string;
  userId: string;
  value: number;
}

export type BookWithUserData = Book & {
  userBook?: UserBook;
  isOnShelf: boolean;
  myRating: number | null;
};

export async function getBooksAll(
  currentPage: number,
  booksPerPage: number,
  genres: GenreSlug[],
  myShelf: boolean,
  userRatings: string[],
  statuses: ReadingStatus[],
  search?: string,
  userId?: string
): Promise<{
  books: BookWithUserData[];
  totalCount: number;
}> {
  const skip = (currentPage - 1) * booksPerPage;

  const includeUnrated = userRatings.includes('none');
  const numericRatings = userRatings.filter((r) => r !== 'none').map(Number);
  const ratingFilters = [];

  if (numericRatings.length > 0 && userId) {
    ratingFilters.push({
      userRatings: { some: { userId, rating: { in: numericRatings } } },
    });
  }

  if (includeUnrated && userId) {
    ratingFilters.push({
      userRatings: { none: { userId } },
    });
  }

  const searchConditions = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
          {
            author: {
              contains: search,
              mode: 'insensitive' as const,
            },
          },
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
    ...(myShelf &&
      userId && {
        userBook: { some: { userId } },
      }),
    ...(ratingFilters.length > 0 && { OR: ratingFilters }),
    ...(statuses.length > 0 &&
      userId && {
        userBook: {
          some: {
            readingStatus: {
              in: statuses,
            },
          },
        },
      }),
  };

  console.log('where', where);

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
        ...(userId && {
          userBook: {
            where: {
              userId: userId,
            },
          },
        }),
        ...(userId && {
          userRatings: {
            // <--- nazwa relacji w liczbie mnogiej
            where: { userId },
            select: { rating: true }, // bierz tylko to, co potrzebne
            take: 1, // bo i tak będzie max 1 rekord (PK: bookId+userId)
          },
        }),
      },
    }),
    prisma.book.count({ where }),
  ]);

  const bookDtos = books.map((book) => {
    const userData = Array.isArray(book.userBook)
      ? book.userBook[0]
      : undefined;
    const myRating = book.userRatings?.[0]?.rating ?? null;
    return {
      ...book,
      userBook: userData,
      isOnShelf: !!userData,
      myRating, // <-- ocena zalogowanego użytkownika
    };
  });

  return {
    books: bookDtos,
    totalCount,
  };
}

export async function getBooks(
  userId: string,
  currentPage: number,
  booksPerPage: number,
  genres: GenreSlug[],
  ratings: string[],
  statuses: ReadingStatus[],
  search?: string
): Promise<{
  books: UserBookDTO[];
  totalCount: number;
}> {
  const skip = (currentPage - 1) * booksPerPage;

  const numericRatings = ratings.filter((r) => r !== 'none').map(Number);
  const includeNull = ratings.includes('none');
  const ratingFilters = [];

  if (numericRatings.length > 0) {
    ratingFilters.push({ rating: { in: numericRatings } });
  }

  if (includeNull) {
    ratingFilters.push({ rating: null });
  }

  // Search conditions (for title, author, genre)
  const searchConditions = search
    ? {
        OR: [
          {
            book: {
              title: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
          {
            book: {
              author: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          },
          {
            book: {
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
          },
        ],
      }
    : {};

  const where = {
    userId,
    ...(statuses.length > 0 && {
      readingStatus: {
        in: statuses,
      },
    }),
    ...(ratingFilters.length > 0 && { OR: ratingFilters }),
    ...searchConditions,
    ...(genres.length > 0 && {
      book: {
        genres: {
          some: {
            genre: {
              slug: { in: genres },
            },
          },
        },
      },
    }),
  };

  const [userBooks, totalCount] = await Promise.all([
    prisma.userBook.findMany({
      skip,
      take: booksPerPage,
      where,
      orderBy: {
        addedAt: 'desc',
      },
      include: {
        book: {
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
        },
      },
    }),

    prisma.userBook.count({
      where,
    }),
  ]);

  // Map to DTO
  const booksDto: UserBookDTO[] = userBooks.map((userBook) => {
    const book = userBook.book;

    const genresDto = book.genres.map((genreRelation) => {
      const translation = genreRelation.genre.translations[0];
      return {
        id: genreRelation.genre.id,
        slug: genreRelation.genre.slug,
        language: translation.language,
        name: translation.name,
      };
    });

    return {
      ...book,
      rating: userBook.rating,
      readingStatus: userBook.readingStatus,
      genres: genresDto,
      userNote: userBook.note,
    };
  });

  return {
    books: booksDto,
    totalCount,
  };
}

export async function deleteBook(bookId: string, userId: string) {
  const book = await prisma.userBook.delete({
    where: {
      bookId_userId: {
        bookId: bookId,
        userId: userId,
      },
    },
  });

  return book;
}

export async function getBook(
  bookId: string,
  loggedUserId: string
): Promise<UserBookDetailsDTO> {
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

export async function addComment(input: AddCommentInput) {
  const { content, authorId, bookId, parentId } = input;

  // Walidacja - musi być albo bookId, albo parentId (odpowiedź)
  if (!bookId && !parentId) {
    throw new Error('Musisz podać bookId lub parentId');
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId,
      bookId,
      parentId,
    },
  });

  return comment;
}

export async function addRating(input: AddRatingInput) {
  const { commentId, userId, value } = input;

  const rating = await prisma.commentRating.create({
    data: {
      userId,
      commentId,
      value,
    },
  });

  return rating;
}

export async function addOrUpdateRating(input: AddRatingInput) {
  const { commentId, userId, value } = input;

  if (value === 0) {
    return await prisma.commentRating.delete({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });
  }

  return await prisma.commentRating.upsert({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
    update: { value },
    create: { commentId, userId, value },
  });
}

export async function getRecentBooksExcludingCurrent(
  userId: string,
  currentBookId: string
): Promise<RecentBookDto[]> {
  return await prisma.userBook.findMany({
    where: {
      userId,
      bookId: { not: currentBookId },
    },
    select: {
      book: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      addedAt: 'desc',
    },
    take: 8,
  });
}
