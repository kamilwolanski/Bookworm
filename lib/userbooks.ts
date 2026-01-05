import {
  Book,
  GenreTranslation,
  MediaFormat,
  Publisher,
  ReadingStatus,
  Review,
  UserBook,
} from '@prisma/client';
import prisma from '@/lib/prisma';
import { normalizeForSearch } from '@/lib/utils';
import { BookCardDTO, GenreDTO } from '@/lib/books';
import { UserEditionDto } from './user/books/types';

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
  // reviews: Review[];
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

export type GetBooksAllResponse = {
  items: BookCardDTO[];
  totalCount: number;
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
          },
        },
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
      },
    };
  });

  return { items, totalCount };
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
        update: { rating, body },
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
