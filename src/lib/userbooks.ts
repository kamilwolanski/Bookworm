import {
  Book,
  Comment,
  Edition,
  GenreTranslation,
  MediaFormat,
  ReadingStatus,
  Review,
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

export interface RatingFilter {
  editions?:
    | {
        some: {
          reviews: {
            some: {
              userId: string;
              rating: {
                in: number[];
              };
            };
          };
        };
      }
    | {
        none: {
          reviews: {
            some: {
              userId: string;
            };
          };
        };
      };
}

export type AddBookToShelfPayload = { bookId: string; editionId: string };
export type RemoveBookFromShelfPayload = { bookId: string; editionId: string };
export type EditionDto = {
  id: string;
  language: string | null;
  format: MediaFormat | null;
  publicationDate: Date | null;
  title: string | null;
  subtitle: string | null;
  coverUrl: string | null;
  isbn13: string | null;
  isbn10: string | null;
  publishers: {
    editionId: string;
    order: number;
    publisher: {
      name: string;
    };
    publisherId: string;
  }[];
};

export type UserEditionDto = {
  editionId: string;
  readingStatus: ReadingStatus;
};

export type BookCardDTO = {
  book: {
    id: string;
    title: string;
    slug: string | null;
    authors: { id: string; name: string }[];
    genres: string[];
    firstPublicationDate: Date | null;
    editions: EditionDto[];
  };
  representativeEdition: EditionDto;
  ratings: {
    bookAverage: number | null;
    bookRatingCount: number | null;
    user: {
      rating: number | null;
    };
  };
  userState: {
    hasAnyEdition: boolean;
    ownedEditionCount: number;
    ownedEditionIds: string[];
    primaryStatus: ReadingStatus | null;
    byEdition: UserEditionDto[];
    notePreview?: string | null;
  };
  badges: {
    onShelf: boolean;
    hasOtherEdition: boolean;
  };
};

export type GetBooksAllResponse = {
  items: BookCardDTO[];
  totalCount: number;
};

function statusPriority(s: ReadingStatus): number {
  // READING > WANT_TO_READ > READ > ABANDONED
  switch (s) {
    case 'READING':
      return 4;
    case 'WANT_TO_READ':
      return 3;
    case 'READ':
      return 2;
    case 'ABANDONED':
      return 1;
    default:
      return 0;
  }
}

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
      editions: {
        some: {
          reviews: { some: { userId, rating: { in: numericRatings } } },
        },
      },
    });
  }
  if (includeUnrated && userId) {
    ratingFilters.push({
      editions: {
        none: { reviews: { some: { userId } } },
      },
    });
  }

  const searchConditions = search?.trim()
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
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
                    { aliases: { has: search } },
                  ],
                },
              },
            },
          },
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
        userBook: { some: { userId, readingStatus: { in: statuses } } },
      }),
  };

  // --- query ---
  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      skip,
      take: booksPerPage,
      where,
      orderBy: { addedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        firstPublicationDate: true,
        averageRating: true,
        ratingCount: true,
        authors: {
          select: {
            personId: true,
            order: true,
            person: { select: { id: true, name: true } },
          },
        },
        genres: {
          select: {
            genre: {
              select: {
                translations: {
                  where: { language: 'pl' },
                  select: { name: true },
                },
              },
            },
          },
        },
        editions: {
          select: {
            id: true,
            language: true,
            publicationDate: true,
            format: true,
            title: true,
            subtitle: true,
            coverUrl: true,
            isbn13: true,
            isbn10: true,
            publishers: {
              include: {
                publisher: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            reviews: userId
              ? {
                  where: { userId },
                  select: {
                    id: true,
                    rating: true,
                    updatedAt: true,
                    userId: true,
                    editionId: true,
                  },
                }
              : false,
          },
        },
        userEditions: userId
          ? {
              where: { userId },
              select: { editionId: true, readingStatus: true, note: true },
            }
          : false,
      },
    }),
    prisma.book.count({ where }),
  ]);

  if (books.length === 0) {
    return { items: [], totalCount };
  }

  // helper: wybór najlepszej edycji
  function pickBestEdition<
    T extends {
      id: string;
      language: string | null;
      publicationDate: Date | null;
      coverUrl: string | null;
      format: MediaFormat | null;
      title: string | null;
      subtitle: string | null;
      reviews?: { rating: number; editionId: string; updatedAt?: Date }[];
    },
  >(editions: T[]): T {
    return editions.reduce((best, e) => {
      const lang = e.language === 'pl' ? 1 : 0;
      const hasCover = e.coverUrl ? 1 : 0;
      const pub = e.publicationDate ? e.publicationDate.getTime() : -Infinity;
      const score = lang * 1e12 + hasCover * 1e10 + pub;

      const bestLang = best.language === 'pl' ? 1 : 0;
      const bestHasCover = best.coverUrl ? 1 : 0;
      const bestPub = best.publicationDate
        ? best.publicationDate.getTime()
        : -Infinity;
      const bestScore = bestLang * 1e12 + bestHasCover * 1e10 + bestPub;

      return score > bestScore ? e : best;
    }, editions[0]);
  }

  const items: BookCardDTO[] = books.map((b) => {
    // representative edition
    const best = pickBestEdition(b.editions);
    const userRating = userId ? (best.reviews?.[0]?.rating ?? null) : null;

    // user state
    const userEditions = b.userEditions ?? [];
    const hasAnyEdition = userEditions.length > 0;
    const byEdition = userEditions.map((ub) => ({
      editionId: ub.editionId as string,
      readingStatus: ub.readingStatus as ReadingStatus,
    }));
    const primaryStatus =
      byEdition.length > 0
        ? byEdition.reduce(
            (acc, cur) =>
              statusPriority(cur.readingStatus) > statusPriority(acc)
                ? cur.readingStatus
                : acc,
            byEdition[0].readingStatus
          )
        : null;

    const ownedEditionIds = byEdition.map((x) => x.editionId);
    const notePreview = userEditions.find((x) => x.note)?.note ?? null;

    return {
      book: {
        id: b.id,
        title: b.title,
        slug: b.slug,
        authors: b.authors
          .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
          .map((a) => ({ id: a.person.id, name: a.person.name })),
        genres: b.genres.flatMap((g) =>
          g.genre.translations.map((t) => t.name)
        ),
        firstPublicationDate: b.firstPublicationDate
          ? b.firstPublicationDate
          : null,
        editions: b.editions,
      },
      representativeEdition: {
        id: best.id,
        language: best.language,
        format: best.format,
        publicationDate: best.publicationDate ? best.publicationDate : null,
        title: best.title,
        subtitle: best.subtitle,
        coverUrl: best.coverUrl,
      },
      ratings: {
        bookAverage: b.averageRating ?? null,
        bookRatingCount: b.ratingCount ?? null,
        user: {
          rating: userRating,
        },
      },
      userState: {
        hasAnyEdition,
        ownedEditionCount: ownedEditionIds.length,
        ownedEditionIds,
        primaryStatus,
        byEdition,
        notePreview,
      },
      badges: {
        onShelf: hasAnyEdition,
        hasOtherEdition: hasAnyEdition && !ownedEditionIds.includes(best.id),
      },
    };
  });

  return { items, totalCount };
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
