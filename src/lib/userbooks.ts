import {
  Book,
  Comment,
  Edition,
  GenreTranslation,
  MediaFormat,
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
  slug: string;
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

export interface DisplayEdition {
  id: string;
  title: string | null;
  subtitle: string | null;
  coverUrl: string | null;
  language: string | null;
  publicationDate: Date | null;
  format: MediaFormat | null;
}

export interface BookGenreWithTranslations {
  genre: {
    translations: GenreTranslation[];
  };
}

export interface BookAuthorForList {
  bookId: string;
  personId: string;
  order: number | null;
  person: { name: string }; // bo selectujesz tylko name
}

export interface BookWithUserDataAndDisplay extends Book {
  genres: BookGenreWithTranslations[];
  authors: BookAuthorForList[];
  userBook?: UserBook;
  userRatings?: { rating: number }[];
  isOnShelf: boolean;
  myRating: number | null;
  displayEdition: DisplayEdition;
  displayTitle: string; // edition.title ?? book.title
  displayCoverUrl: string | null; // edition.coverUrl ?? null
}

export interface GetBooksAllResponse {
  books: BookWithUserDataAndDisplay[];
  totalCount: number;
}

export interface RatingFilter {
  userRatings?:
    | {
        some: {
          userId: string;
          rating: {
            in: number[];
          };
        };
      }
    | {
        none: {
          userId: string;
        };
      };
}

export type AddBookToShelfPayload = { bookId: string; editionId: string };
export type RemoveBookFromShelfPayload = { bookId: string; editionId: string };

export async function getBooksAll(
  currentPage: number,
  booksPerPage: number,
  genres: string[],
  myShelf: boolean,
  userRatings: string[],
  statuses: ReadingStatus[],
  search?: string,
  userId?: string
): Promise<GetBooksAllResponse> {
  const skip = (currentPage - 1) * booksPerPage;

  const includeUnrated = userRatings.includes('none');
  const numericRatings = userRatings.filter((r) => r !== 'none').map(Number);
  const ratingFilters: RatingFilter[] = [];

  if (numericRatings.length > 0 && userId) {
    ratingFilters.push({
      userRatings: { some: { userId, rating: { in: numericRatings } } },
    });
  }
  if (includeUnrated && userId) {
    ratingFilters.push({ userRatings: { none: { userId } } });
  }

  const searchConditions = search?.trim()
    ? {
        OR: [
          // 1) Oryginalny tytuł książki
          { title: { contains: search, mode: 'insensitive' as const } },

          // 2) Tytuł/subtytuł edycji po polsku
          {
            editions: {
              some: {
                language: 'pl',
                OR: [
                  { title: { contains: search, mode: 'insensitive' as const } },
                  {
                    subtitle: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                ],
              },
            },
          },

          // 3) Autor (Person) powiązany z Book
          {
            authors: {
              some: {
                person: {
                  OR: [
                    {
                      name: { contains: search, mode: 'insensitive' as const },
                    },
                    {
                      sortName: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                    // Uwaga: aliases to String[] — operator 'has' sprawdza pełny element, nie "contains".
                    // Przyda się dla dokładnych aliasów (np. "J.K. Rowling"), ale nie dla fraz typu "Rowl".
                    { aliases: { has: search } },
                  ],
                },
              },
            },
          },

          // 4) Nazwy gatunków PL (jak masz już)
          {
            genres: {
              some: {
                genre: {
                  translations: {
                    some: {
                      language: 'pl',
                      name: { contains: search, mode: 'insensitive' as const },
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
      genres: { some: { genre: { slug: { in: genres } } } },
    }),
    ...(myShelf && userId && { userBook: { some: { userId } } }),
    ...(ratingFilters.length > 0 && { OR: ratingFilters }),
    ...(statuses.length > 0 &&
      userId && {
        userBook: { some: { readingStatus: { in: statuses } } },
      }),
  };

  // 1) Książki + total
  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      skip,
      take: booksPerPage,
      where,
      orderBy: { addedAt: 'desc' },
      include: {
        authors: {
          include: {
            person: {
              select: {
                name: true,
              },
            },
          },
        },
        genres: {
          include: {
            genre: {
              include: { translations: { where: { language: 'pl' } } },
            },
          },
        },
        ...(userId && { userBook: { where: { userId } } }),
        ...(userId && {
          userRatings: {
            where: { userId },
            select: { rating: true },
            take: 1,
          },
        }),
      },
    }),
    prisma.book.count({ where }),
  ]);

  const bookIds = books.map((b) => b.id);
  if (bookIds.length === 0) {
    return { books: [], totalCount };
  }

  // wszystkie edycje dla bieżących książek
  const editions = await prisma.edition.findMany({
    where: { bookId: { in: bookIds } },
    select: {
      id: true,
      bookId: true,
      title: true,
      subtitle: true,
      coverUrl: true,
      language: true,
      publicationDate: true,
      format: true,
    },
  });

  // helper do wybrania najlepszej edycji z listy
  function pickBestEdition(
    editions: Pick<
      Edition,
      | 'id'
      | 'bookId'
      | 'title'
      | 'subtitle'
      | 'coverUrl'
      | 'language'
      | 'publicationDate'
      | 'format'
    >[]
  ): (typeof editions)[number] {
    return editions.reduce((best, e) => {
      const lang = e.language === 'pl' ? 1 : 0;
      const hasCover = e.coverUrl ? 1 : 0;
      const pub = e.publicationDate ? e.publicationDate.getTime() : -Infinity;
      const score = lang * 1e12 + hasCover * 1e10 + pub;

      const bestScore = (() => {
        const lang = best.language === 'pl' ? 1 : 0;
        const hasCover = best.coverUrl ? 1 : 0;
        const pub = best.publicationDate
          ? best.publicationDate.getTime()
          : -Infinity;
        return lang * 1e12 + hasCover * 1e10 + pub;
      })();

      return score > bestScore ? e : best;
    });
  }

  const dto = books.map((book) => {
    const userData = Array.isArray(book.userBook)
      ? book.userBook[0]
      : undefined;
    const myRating = book.userRatings?.[0]?.rating ?? null;

    const bookEds = editions.filter((e) => e.bookId === book.id);
    if (bookEds.length === 0) {
      throw new Error(`Book ${book.id} has no editions!`);
    }
    const best = pickBestEdition(bookEds);

    const displayEdition: DisplayEdition = {
      id: best.id,
      title: best.title,
      subtitle: best.subtitle,
      coverUrl: best.coverUrl,
      language: best.language,
      publicationDate: best.publicationDate,
      format: best.format,
    };

    return {
      ...book,
      userBook: userData,
      isOnShelf: !!userData,
      myRating,
      displayEdition,
      displayTitle: displayEdition.title ?? book.title,
      displayCoverUrl: displayEdition.coverUrl ?? null,
    };
  });

  return { books: dto, totalCount };
}

export async function removeBookFromShelf(
  userId: string,
  { bookId, editionId }: RemoveBookFromShelfPayload
): Promise<void> {
  await prisma.userBook.delete({
    where: {
      bookId_userId_editionId: {
        userId,
        bookId,
        editionId,
      },
    },
  });
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

export async function addBookToShelf(
  userId: string,
  { bookId, editionId }: AddBookToShelfPayload
): Promise<UserBook> {
  return await prisma.userBook.create({
    data: {
      bookId,
      editionId,
      userId,
    },
  });
}
