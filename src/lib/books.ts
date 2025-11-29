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

type BookEditionMetaData = {
  title: string | null;
  description: string | null;
};

type BookEditionForSitemap = {
  id: string;
  updatedAt: Date;
  book: {
    slug: string;
  };
};

export async function findUniqueBook(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true },
  });

  return book;
}

export async function getTheNewestEditions(take: number = 5) {
  const newestEditions = await prisma.edition.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      coverUrl: true,
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
          editions: {
            orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
            select: {
              id: true,
              language: true,
              publicationDate: true,
              title: true,
              subtitle: true,
              coverUrl: true,
              publishers: {
                include: {
                  publisher: true,
                },
              },
            },
          },
        },
      },
    },
    take,
  });
  const items: BookCardDTO[] = newestEditions.map((edition) => {
    const book = edition.book;

    return {
      book: {
        id: book.id,
        title: book.title,
        slug: book.slug ?? '',
        authors: book.authors
          .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
          .map((a) => ({ id: a.person.id, name: a.person.name })),
        editions: book.editions,
      },
      representativeEdition: {
        id: edition.id,
        title: edition.title,
        subtitle: edition.subtitle,
        coverUrl: edition.coverUrl,
      },
      ratings: {
        bookAverage: book.averageRating ?? null,
        bookRatingCount: book.ratingCount ?? null,
      },
    };
  });
  return items;
}

export async function getTopBooksWithTopEdition(
  take: number = 5,
  lastDays: number = 14
) {
  const since = subDays(new Date(), lastDays);

  // 1) TOP 6 książek wg sumy dodań (wszystkie edycje) w ostatnich 14 dniach
  const topBooks = await prisma.userBook.groupBy({
    by: ['bookId'],
    where: { addedAt: { gte: since } },
    _count: { _all: true },
    orderBy: { _count: { bookId: 'desc' } },
    take,
  });

  if (topBooks.length === 0) return [];

  // 2) Dla każdej książki: znajdź najczęściej dodawaną edycję w tym samym oknie czasu
  //    (w razie remisu – stabilne, deterministyczne: sortujemy dodatkowo po editionId)
  const results: BookCardDTO[] = await Promise.all(
    topBooks.map(async ({ bookId }) => {
      const topEditionGroup = await prisma.userBook.groupBy({
        by: ['editionId'],
        where: { addedAt: { gte: since }, bookId },
        _count: { _all: true },
        orderBy: [{ _count: { editionId: 'desc' } }, { editionId: 'asc' }],
        take: 1,
      });

      const editionId = topEditionGroup[0].editionId;

      const [bookRaw, topEdition] = await Promise.all([
        prisma.book.findUniqueOrThrow({
          where: { id: bookId },
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
            editions: {
              select: {
                id: true,
                language: true,
                publicationDate: true,
                title: true,
                subtitle: true,
                coverUrl: true,
                publishers: {
                  include: {
                    publisher: true,
                  },
                },
              },
            },
          },
        }),
        prisma.edition.findUniqueOrThrow({
          where: { id: editionId },
          select: {
            id: true,
            title: true,
            subtitle: true,
            coverUrl: true,
          },
        }),
      ]);

      return {
        book: {
          id: bookRaw.id,
          title: bookRaw.title,
          slug: bookRaw.slug,
          authors: bookRaw.authors
            .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
            .map((a) => ({ id: a.person.id, name: a.person.name })),
          firstPublicationDate: bookRaw?.firstPublicationDate
            ? bookRaw?.firstPublicationDate
            : null,
          editions: bookRaw?.editions,
        },
        ratings: {
          bookAverage: bookRaw?.averageRating ?? null,
          bookRatingCount: bookRaw?.ratingCount ?? null,
        },
        representativeEdition: {
          id: topEdition.id,
          title: topEdition.title,
          subtitle: topEdition.subtitle,
          coverUrl: topEdition.coverUrl,
        },
      };
    })
  );

  return results;
}

export async function getBestRatedBooks(take: number = 5) {
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
      editions: {
        orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          language: true,
          publicationDate: true,
          title: true,
          subtitle: true,
          coverUrl: true,
          publishers: {
            include: {
              publisher: true,
            },
          },
        },
      },
    },
    take,
  });

  const items: BookCardDTO[] = topBooks.map((b) => {
    const newestEdition = b.editions[0];

    return {
      book: {
        id: b.id,
        title: b.title,
        slug: b.slug ?? '',
        authors: b.authors
          .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
          .map((a) => ({ id: a.person.id, name: a.person.name })),
        firstPublicationDate: b.firstPublicationDate
          ? b.firstPublicationDate
          : null,
        editions: b.editions,
      },
      representativeEdition: {
        id: newestEdition.id,
        title: newestEdition.title,
        subtitle: newestEdition.subtitle,
        coverUrl: newestEdition.coverUrl,
      },
      ratings: {
        bookAverage: b.averageRating ?? null,
        bookRatingCount: b.ratingCount ?? null,
      },
    };
  });

  return items;
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

export async function getBookEditionMetaData(
  editionId: string
): Promise<BookEditionMetaData> {
  return await prisma.edition.findUniqueOrThrow({
    where: {
      id: editionId,
    },
    select: {
      title: true,
      description: true,
    },
  });
}

export async function getAllBooksEditionForSitemap(): Promise<
  BookEditionForSitemap[]
> {
  return await prisma.edition.findMany({
    select: {
      id: true,
      updatedAt: true,
      book: {
        select: {
          slug: true,
        },
      },
    },
  });
}
