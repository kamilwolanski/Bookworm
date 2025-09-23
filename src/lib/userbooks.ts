import {
  Book,
  GenreTranslation,
  MediaFormat,
  Publisher,
  ReadingStatus,
  Review,
  User,
  UserBook,
} from '@prisma/client';
import prisma from './prisma';

export type GenreDTO = {
  id: string;
  slug: string;
  language: string;
  name: string;
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

export type AddBookToShelfPayload = {
  bookId: string;
  editionId: string;
  readingStatus: ReadingStatus;
  rating?: number;
  body?: string;
};

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
    order: number | null;
    publisher: Publisher;
    publisherId: string;
  }[];
  reviews: Review[];
};

export type UserEditionDto = {
  editionId: string;
  readingStatus: ReadingStatus;
};

export type BookCardDTO = {
  book: {
    id: string;
    title: string;
    slug: string;
    authors: { id: string; name: string }[];
    genres: string[];
    firstPublicationDate: Date | null;
    editions: EditionDto[];
  };
  representativeEdition: {
    id: string;
    language: string | null;
    format: MediaFormat | null;
    publicationDate: Date | null;
    title: string | null;
    subtitle: string | null;
    coverUrl: string | null;
  };
  ratings: {
    bookAverage: number | null;
    bookRatingCount: number | null;
    representativeEditionRating: number | null;
    userReviews: Review[];
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

export type BookDetailsDto = {
  edition: {
    id: string;
    title: string; // edition.title || book.title
    subtitle?: string | null;
    description?: string | null;
    isbn13?: string | null;
    isbn10?: string | null;
    language?: string | null;
    publicationDate?: string | null; // ISO
    pageCount?: number | null;
    format?: MediaFormat | null;
    coverUrl?: string | null;
    coverPublicId?: string | null;
  };
  book: {
    id: string;
    slug?: string | null;
    title: string;
    authors: { name: string; slug: string; order: number | null }[];
    genres: (GenreTranslation & { slug: string })[];
  };

  publishers: {
    id: string;
    name: string;
    slug: string;
    order: number | null;
  }[];
};

export type OtherEditionDto = {
  id: string;
  coverUrl: string | null;
  title: string | null;
};

type GetBookReviewsResult = {
  items: Array<
    Review & {
      user: { id: string; name: string | null; avatarUrl: string | null };
      edition: {
        id: string;
        language: string | null;
        format: MediaFormat | null;
      };
    }
  >;
  total: number;
  page: number;
  pageSize: number;
};

type GetBookReviewsOptions = {
  page?: number;
  pageSize?: number;
  onlyWithContent?: boolean;
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
  rating?: string,
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
    ...(myShelf && userId && { userEditions: { some: { userId } } }),
    ...(ratingFilters.length > 0 && { OR: ratingFilters }),
    ...(rating && {
      averageRating: {
        gte: Number(rating),
      },
    }),
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
                publisher: true,
              },
            },
            reviews: userId
              ? {
                  where: { userId },
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
  function pickBestEdition(editions: EditionDto[]) {
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
        slug: b.slug ?? '',
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
        representativeEditionRating: userRating,
        userReviews: b.editions.map((e) => e.reviews).flat(),
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

export async function getBook(
  editionId: string,
  userId?: string
): Promise<BookDetailsDto> {
  const edition = await prisma.edition.findUniqueOrThrow({
    where: { id: editionId },
    select: {
      id: true,
      isbn13: true,
      isbn10: true,
      language: true,
      publicationDate: true,
      pageCount: true,
      format: true,
      coverUrl: true,
      coverPublicId: true,
      title: true,
      subtitle: true,
      description: true,
      book: {
        select: {
          genres: {
            select: {
              genre: {
                select: {
                  slug: true,
                  translations: {
                    // jeśli chcesz konkretny język:
                    // where: { language: lang },
                    select: {
                      id: true,
                      genreId: true,
                      language: true,
                      name: true,
                    },
                    orderBy: { language: 'asc' }, // opcjonalnie
                    take: 1, // bierzemy jedno tłumaczenie (np. pierwsze/pasujące)
                  },
                },
              },
            },
          },
          id: true,
          slug: true,
          title: true,
          authors: {
            select: {
              order: true,
              person: { select: { name: true, slug: true } },
            },
            orderBy: { order: 'asc' },
          },
        },
      },
      publishers: {
        select: {
          order: true,
          publisher: { select: { id: true, name: true, slug: true } },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  const dto: BookDetailsDto = {
    edition: {
      id: edition.id,
      title: edition.title ?? edition.book.title,
      subtitle: edition.subtitle ?? null,
      description: edition.description ?? null,
      isbn13: edition.isbn13 ?? null,
      isbn10: edition.isbn10 ?? null,
      language: edition.language ?? null,
      publicationDate: edition.publicationDate
        ? edition.publicationDate.toISOString()
        : null,
      pageCount: edition.pageCount ?? null,
      format: edition.format ?? null,
      coverUrl: edition.coverUrl ?? null,
      coverPublicId: edition.coverPublicId ?? null,
    },
    book: {
      id: edition.book.id,
      slug: edition.book.slug ?? null,
      title: edition.book.title,
      authors: edition.book.authors.map((a) => ({
        name: a.person.name,
        slug: a.person.slug,
        order: a.order ?? null,
      })),
      genres: edition.book.genres.flatMap((g) => {
        const tr = g.genre.translations[0];
        return tr
          ? [
              {
                id: tr.id,
                genreId: tr.genreId,
                language: tr.language,
                name: tr.name,
                slug: g.genre.slug,
              },
            ]
          : [];
      }),
    },
    publishers: edition.publishers.map((p) => ({
      id: p.publisher.id,
      name: p.publisher.name,
      slug: p.publisher.slug,
      order: p.order ?? null,
    })),
  };
  return dto;
}

export async function getOtherEditions(
  bookSlug: string,
  editionId: string
): Promise<OtherEditionDto[]> {
  const otherEditions = await prisma.book.findUnique({
    where: {
      slug: bookSlug,
    },
    include: {
      editions: {
        where: {
          NOT: {
            id: editionId,
          },
        },
        select: {
          id: true,
          title: true,
          coverUrl: true,
        },
      },
    },
  });

  return otherEditions?.editions ?? [];
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

export async function addBookToShelfWithReview(
  userId: string,
  { bookId, editionId, readingStatus, rating, body }: AddBookToShelfPayload
): Promise<void> {
  console.log('rating', rating);
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    throw new Error('Rating must be between 1 and 5.');
  }

  await prisma.$transaction(async (tx) => {
    const ub = await tx.userBook.create({
      data: {
        bookId,
        editionId,
        userId,
        readingStatus,
      },
    });

    if (rating || body) {
      await tx.review.upsert({
        where: {
          userId_editionId: { userId, editionId },
        },
        create: { editionId, userId, rating, body },
        update: { rating },
      });

      const aggs = await tx.review.aggregate({
        where: { editionId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const avg = Number((aggs._avg.rating ?? 0).toFixed(2));
      const count = aggs._count.rating;

      await tx.book.update({
        where: { id: bookId },
        data: {
          averageRating: avg,
          ratingCount: count,
        },
      });
    }

    return ub;
  });
}

export async function getBookReviews(
  bookSlug: string,
  {
    page = 1,
    pageSize = 20,
    onlyWithContent = false,
  }: GetBookReviewsOptions = {}
): Promise<GetBookReviewsResult> {
  const skip = (page - 1) * pageSize;

  // warunek treści – null i pusty string
  const contentWhere = onlyWithContent
    ? { AND: [{ body: { not: null } }, { body: { not: '' } }] }
    : {};

  const where = {
    edition: { book: { slug: bookSlug } },
    ...contentWhere,
  };

  const [items, total] = await prisma.$transaction([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        edition: { select: { id: true, language: true, format: true } },
      },
    }),
    prisma.review.count({ where }),
  ]);
  
  return { items, total, page, pageSize };
}
