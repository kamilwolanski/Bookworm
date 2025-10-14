import { BookCardDTO, GenreDTO, statusPriority } from './userbooks';
import prisma from '@/lib/prisma';
import { Book, ReadingStatus } from '@prisma/client';
import { subDays } from 'date-fns';

export type BookDTO = Book & {
  genres?: GenreDTO[];
};

export type CreateBookData = Omit<
  Book,
  'id' | 'addedAt' | 'averageRating' | 'ratingCount'
>;

export type RateData = {
  averageRating: number;
  ratingCount: number;
  userRating: number;
};

export type OtherEditionDto = {
  id: string;
  coverUrl: string | null;
  title: string | null;
};

export async function findUniqueBook(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true },
  });

  return book;
}

export async function getTheNewestEditions(userId?: string, take: number = 5) {
  const newestEditions = await prisma.edition.findMany({
    orderBy: {
      createdAt: 'desc',
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
      book: {
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
            orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
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
      },
    },
    take,
  });
  const items: BookCardDTO[] = newestEditions.map((edition) => {
    const book = edition.book;
    const userRating = userId ? edition.reviews[0]?.rating : null;
    const userEditions = book.userEditions ?? [];
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
        id: book.id,
        title: book.title,
        slug: book.slug ?? '',
        authors: book.authors
          .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
          .map((a) => ({ id: a.person.id, name: a.person.name })),
        genres: book.genres.flatMap((g) =>
          g.genre.translations.map((t) => t.name)
        ),
        firstPublicationDate: book.firstPublicationDate
          ? book.firstPublicationDate
          : null,
        editions: book.editions,
      },
      representativeEdition: {
        id: edition.id,
        language: edition.language,
        format: edition.format,
        publicationDate: edition.publicationDate
          ? edition.publicationDate
          : null,
        title: edition.title,
        subtitle: edition.subtitle,
        coverUrl: edition.coverUrl,
      },
      ratings: {
        bookAverage: book.averageRating ?? null,
        bookRatingCount: book.ratingCount ?? null,
        representativeEditionRating: userRating,
        userReviews: userId
          ? book.editions.map((e) => e.reviews).flat()
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
        hasOtherEdition: hasAnyEdition && !ownedEditionIds.includes(edition.id),
      },
    };
  });
  return items;
}

export async function getBestRatedBooks(userId?: string, take: number = 5) {
  const topBooks = await prisma.book.findMany({
    where: { averageRating: { not: null } },

    orderBy: [
      { averageRating: 'desc' },
      { ratingCount: 'desc' },
      { addedAt: 'desc' },
    ],
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
        orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
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
    take,
  });

  const items: BookCardDTO[] = topBooks.map((b) => {
    const newestEdition = b.editions[0];
    const userRating = userId ? newestEdition.reviews[0]?.rating : null;

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
        id: newestEdition.id,
        language: newestEdition.language,
        format: newestEdition.format,
        publicationDate: newestEdition.publicationDate
          ? newestEdition.publicationDate
          : null,
        title: newestEdition.title,
        subtitle: newestEdition.subtitle,
        coverUrl: newestEdition.coverUrl,
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
        hasOtherEdition:
          hasAnyEdition && !ownedEditionIds.includes(newestEdition.id),
      },
    };
  });

  return items;
}

export async function getTopBooksWithTopEdition(
  userId?: string,
  take: number = 5,
  lastDays: number = 7
) {
  const since = subDays(new Date(), lastDays);

  // 1) TOP 6 książek wg sumy dodań (wszystkie edycje) w ostatnich 7 dniach
  const topBooks = await prisma.userBook.groupBy({
    by: ['bookId'],
    where: { addedAt: { gte: since } },
    _count: { _all: true },
    // ⬇️ zamiast { _count: { _all: "desc" } }
    orderBy: { _count: { bookId: 'desc' } },
    take,
  });

  if (topBooks.length === 0) return [];

  // 2) Dla każdej książki: znajdź najczęściej dodawaną edycję w tym samym oknie czasu
  //    (w razie remisu – stabilne, deterministyczne: sortujemy dodatkowo po editionId)
  const results = await Promise.all(
    topBooks.map(async ({ bookId, _count }) => {
      const topEditionGroup = await prisma.userBook.groupBy({
        by: ['editionId'],
        where: { addedAt: { gte: since }, bookId },
        _count: { _all: true },
        // ⬇️ zamiast [{ _count: { _all: "desc" } }, { editionId: "asc" }]
        orderBy: [{ _count: { editionId: 'desc' } }, { editionId: 'asc' }],
        take: 1,
      });

      const editionId = topEditionGroup[0].editionId;
      const editionAdds = topEditionGroup[0]._count._all ?? 0;

      const [bookRaw, topEdition] = await Promise.all([
        prisma.book.findUniqueOrThrow({
          where: { id: bookId },
          // include: { authors: { include: { person: true } }, genres: true },
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
        prisma.edition.findUniqueOrThrow({
          where: { id: editionId },
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
            reviews: userId
              ? {
                  where: { userId },
                }
              : false,
          },
        }),
      ]);

      const userRating = userId
        ? (topEdition?.reviews?.[0]?.rating ?? null)
        : null;

      // user state
      const userEditions = bookRaw?.userEditions ?? [];
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
          id: bookRaw.id,
          title: bookRaw.title,
          slug: bookRaw.slug,
          authors: bookRaw.authors
            .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
            .map((a) => ({ id: a.person.id, name: a.person.name })),
          genres: bookRaw?.genres.flatMap((g) =>
            g.genre.translations.map((t) => t.name)
          ),
          firstPublicationDate: bookRaw?.firstPublicationDate
            ? bookRaw?.firstPublicationDate
            : null,
          editions: bookRaw?.editions,
        },
        ratings: {
          bookAverage: bookRaw?.averageRating ?? null,
          bookRatingCount: bookRaw?.ratingCount ?? null,
          representativeEditionRating: userRating,
          userReviews: userId
            ? bookRaw?.editions.map((e) => e.reviews).flat()
            : undefined,
        },
        representativeEdition: {
          id: topEdition.id,
          language: topEdition.language,
          format: topEdition.format,
          publicationDate: topEdition.publicationDate
            ? topEdition.publicationDate
            : null,
          title: topEdition.title,
          subtitle: topEdition.subtitle,
          coverUrl: topEdition.coverUrl,
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
          hasOtherEdition:
            hasAnyEdition && !ownedEditionIds.includes(topEdition?.id ?? ''),
        },
        bookAdds: _count._all,
        editionAdds,
      };
    })
  );

  // 3) Zachowujemy kolejność wg popularności książek
  // (groupBy już zwrócił posortowane; Promise.all utrzyma indeksy)
  return results;
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
