import {
  Book,
  GenreTranslation,
  MediaFormat,
  Publisher,
  ReadingStatus,
  Review,
  ReviewVoteType,
  UserBook,
} from '@prisma/client';
import prisma from '@/lib/prisma';
import { getUserSession } from '@/lib/session';
import { normalizeForSearch } from '@/lib/utils';

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
export type EditionDtoDeprecated = {
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
};

export type UserEditionDto = {
  editionId: string;
};

export type BookCardDTODeprecated = {
  book: {
    id: string;
    title: string;
    slug: string;
    authors: { id: string; name: string }[];
    genres: string[];
    firstPublicationDate: Date | null;
    editions: EditionDtoDeprecated[];
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
    userReviews?: Review[];
  };
  userState?: {
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
  };
};

export type GetBooksAllResponse = {
  items: BookCardDTO[];
  totalCount: number;
};

export interface VoteActionResult {
  removed: boolean;
  currentType?: ReviewVoteType;
}

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
    slug: string;
    title: string;
    authors: { name: string; slug: string; order: number | null }[];
    genres: (Omit<GenreTranslation, 'name_search'> & { slug: string })[];
    ratingCount: number | null;
    averageRating: number | null;
  };
  publishers: {
    id: string;
    name: string;
    slug: string;
    order: number | null;
  }[];
  userBook: {
    isOnShelf: boolean;
    readingstatus?: ReadingStatus;
    userReview?: {
      editionId: string;
      rating: number | null;
      body: string | null;
    };
  } | null;
};

export function statusPriority(s: ReadingStatus): number {
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

export async function getBooksAll({
  currentPage,
  booksPerPage,
  genres,
  myShelf,
  userRatings,
  statuses,
  rating,
  search,
  userId,
  authorSlug,
}: {
  currentPage: number;
  booksPerPage: number;
  genres: string[];
  myShelf: boolean;
  userRatings: string[];
  statuses: ReadingStatus[];
  rating?: string;
  search?: string;
  userId?: string;
  authorSlug?: string;
}): Promise<GetBooksAllResponse> {
  const skip = (currentPage - 1) * booksPerPage;

  const includeUnrated = userRatings.includes('none');
  const numericRatings = userRatings.filter((r) => r !== 'none').map(Number);
  const ratingFilters: RatingFilter[] = [];
  const normalized = search?.trim() ? normalizeForSearch(search) : '';

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

  const searchConditions = normalized
    ? {
        OR: [
          // Tytuł książki
          { title_search: { contains: normalized } },

          // Polskie tytuły / podtytuły edycji
          {
            editions: {
              some: {
                language: 'pl',
                OR: [
                  { title_search: { contains: normalized } },
                  { subtitle_search: { contains: normalized } },
                ],
              },
            },
          },

          // Autorzy: name / sortName / aliases (znormalizowane)
          {
            authors: {
              some: {
                person: {
                  OR: [
                    { name_search: { contains: normalized } },
                    { sortName_search: { contains: normalized } },
                    { aliasesSearch: { has: normalized } }, // szybkie sprawdzenie w tablicy
                  ],
                },
              },
            },
          },

          // Gatunki (polskie tłumaczenia)
          {
            genres: {
              some: {
                genre: {
                  translations: {
                    some: {
                      language: 'pl',
                      name_search: { contains: normalized },
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
        userEditions: { some: { userId, readingStatus: { in: statuses } } },
      }),
    ...(authorSlug && {
      authors: {
        some: {
          person: {
            slug: authorSlug,
          },
        },
      },
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
          orderBy: {
            publicationDate: 'desc',
          },
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
  function pickBestEdition(editions: EditionDtoDeprecated[]) {
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
        userReviews: userId
          ? b.editions.map((e) => e.reviews).flat()
          : undefined,
      },
      userState: userId
        ? {
            hasAnyEdition,
            ownedEditionCount: ownedEditionIds.length,
            ownedEditionIds,
            primaryStatus,
            byEdition,
            notePreview,
          }
        : undefined,
      badges: {
        onShelf: hasAnyEdition,
        hasOtherEdition: hasAnyEdition && !ownedEditionIds.includes(best.id),
      },
    };
  });

  return { items, totalCount };
}

export async function getBook(editionId: string): Promise<BookDetailsDto> {
  const session = await getUserSession();
  const currentUserId: string | null = session?.user?.id ?? null;
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
      userBooks: currentUserId
        ? {
            where: { userId: currentUserId },
          }
        : false, // <-- Prisma pominie całkowicie pole, jeśli damy false
      reviews: currentUserId
        ? {
            where: { userId: currentUserId },
            select: {
              rating: true,
              body: true,
              editionId: true,
            },
            take: 1,
          }
        : false,
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
          ratingCount: true,
          averageRating: true,
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

  const isOnShelf = edition.userBooks?.length > 0 ? true : false;
  const userBook = edition.userBooks?.length > 0 && edition.userBooks[0];

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
      ratingCount: edition.book.ratingCount,
      averageRating: edition.book.averageRating,
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
    userBook: currentUserId
      ? {
          isOnShelf: isOnShelf,
          ...(isOnShelf && {
            readingstatus: userBook ? userBook.readingStatus : undefined,
          }),
          userReview: edition.reviews?.[0] ?? null,
        }
      : null,
  };
  return dto;
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
  { bookId, editionId }: { bookId: string; editionId: string }
): Promise<UserBook> {
  return await prisma.userBook.create({
    data: {
      bookId,
      editionId,
      userId,
    },
  });
}

export async function changeBookStatus(
  userId: string,
  {
    bookId,
    editionId,
    readingStatus,
  }: { bookId: string; editionId: string; readingStatus: ReadingStatus }
): Promise<UserBook> {
  return await prisma.userBook.update({
    where: {
      bookId_userId_editionId: {
        bookId,
        userId,
        editionId,
      },
    },
    data: {
      readingStatus,
    },
  });
}

export async function addBookToShelfWithReview(
  userId: string,
  { bookId, editionId, readingStatus, rating, body }: AddBookToShelfPayload
): Promise<void> {
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

      const avg = Number((aggs._avg.rating ?? 0).toFixed(1));
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

export async function upsertReviewVote(
  userId: string,
  { reviewId, type }: { reviewId: string; type: ReviewVoteType }
): Promise<{ removed: boolean; currentType?: ReviewVoteType }> {
  // 1) Sprawdź właściciela opinii (nie można głosować na siebie)
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review) {
    // możesz też zwrócić 404 w akcjach, jeśli chcesz
    throw new Error('Review not found');
  }

  const existing = await prisma.reviewVote.findUnique({
    where: { reviewId_userId: { reviewId, userId } },
  });

  if (existing) {
    if (existing.type === type) {
      // toggle: ten sam typ -> usuń głos
      await prisma.reviewVote.delete({
        where: { reviewId_userId: { reviewId, userId } },
      });
      return { removed: true };
    }
    // zmiana typu
    const updated = await prisma.reviewVote.update({
      where: { reviewId_userId: { reviewId, userId } },
      data: { type },
    });
    return { removed: false, currentType: updated.type };
  }

  // 3) Brak głosu -> utwórz
  const created = await prisma.reviewVote.create({
    data: { reviewId, userId, type },
  });

  return { removed: false, currentType: created.type };
}
