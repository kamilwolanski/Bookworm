import { Book, Comment, GenreSlug, User } from '@prisma/client';
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

export type BookDetailsDTO = Book & {
  genres?: GenreDTO[];
  comments: (CommentDto & { author: User })[];
};

export type BookListDTO = Book & {
  genres?: GenreDTO[];
};

export type CommentDto = Comment & {
  totalScore: number;
  userRating: number | null;
  ratings: {
    value: number;
    userId: string;
  }[];
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
  booksPerPage: number,
  search?: string // 👈 Nowy opcjonalny parametr
): Promise<{
  books: BookListDTO[];
  totalCount: number;
}> {
  const skip = (currentPage - 1) * booksPerPage;

  // 🔍 Jeśli nie ma frazy, nie dodajemy warunku OR
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

  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      skip,
      take: booksPerPage,
      where: {
        userId,
        ...searchConditions, // 👈 dodajemy warunki wyszukiwania tylko gdy są
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

    prisma.book.count({
      where: {
        userId,
        ...searchConditions, // 👈 count musi mieć ten sam filtr!
      },
    }),
  ]);

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
        },
      },
    },
  });

  const commentsWithScores = book.comments.map((comment) => {
    const totalScore = comment.ratings.reduce((sum, r) => sum + r.value, 0);

    const userRating =
      comment.ratings.find((r) => r.userId === loggedUserId)?.value ?? null;

    return {
      ...comment,
      totalScore,
      userRating, // <- to będzie np. 1, -1, lub null jeśli brak
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
