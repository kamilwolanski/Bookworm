import prisma from "@/lib/prisma";
import { BookCardDTO, EditionDto, GetBooksAllResponse, RatingFilter } from "./types";
import { subDays } from "date-fns";
import { unstable_cache } from "next/cache";
import { normalizeForSearch } from "@/lib/utils";
import { Prisma, ReadingStatus } from "@prisma/client";

export const getTheNewestEditionsCached = unstable_cache(
  async () => {
    return getTheNewestEditions();
  },
  ["popular-books"],
  { revalidate: 3600 }
);

export const getTopBooksWithTopEditionCached = unstable_cache(
  async () => {
    return getTopBooksWithTopEdition();
  },
  ["top-books-with-top-edition"],
  { revalidate: 3600 }
);

export const getBestRatedBooksCached = unstable_cache(
  async () => {
    return getBestRatedBooks();
  },
  ["best-rated-books"],
  { revalidate: 3600 }
);

export async function getTheNewestEditions(take: number = 5) {
  const newestEditions = await prisma.edition.findMany({
    orderBy: {
      createdAt: "desc",
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
            orderBy: [{ publicationDate: "desc" }, { createdAt: "desc" }],
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
        slug: book.slug ?? "",
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
    by: ["bookId"],
    where: { addedAt: { gte: since } },
    _count: { _all: true },
    orderBy: { _count: { bookId: "desc" } },
    take,
  });

  if (topBooks.length === 0) return [];

  // 2) Dla każdej książki: znajdź najczęściej dodawaną edycję w tym samym oknie czasu
  //    (w razie remisu – stabilne, deterministyczne: sortujemy dodatkowo po editionId)
  const results: BookCardDTO[] = await Promise.all(
    topBooks.map(async ({ bookId }) => {
      const topEditionGroup = await prisma.userBook.groupBy({
        by: ["editionId"],
        where: { addedAt: { gte: since }, bookId },
        _count: { _all: true },
        orderBy: [{ _count: { editionId: "desc" } }, { editionId: "asc" }],
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
      { averageRating: "desc" },
      { ratingCount: "desc" },
      { addedAt: "desc" },
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
        orderBy: [{ publicationDate: "desc" }, { createdAt: "desc" }],
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
        slug: b.slug ?? "",
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

  const includeUnrated = userRatings.includes("none");
  const numericRatings = userRatings.filter((r) => r !== "none").map(Number);
  const ratingFilters: RatingFilter[] = [];
  const normalized = search?.trim() ? normalizeForSearch(search) : "";

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
                language: "pl",
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
                  OR: [
                    {
                      slug: {
                        contains: normalized,
                        mode: Prisma.QueryMode.insensitive,
                      },
                    },
                    {
                      translations: {
                        some: {
                          language: "pl",
                          name_search: { contains: normalized },
                        },
                      },
                    },
                  ],
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
      orderBy: { addedAt: "desc" },
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
                  where: { language: "pl" },
                  select: { name: true },
                },
              },
            },
          },
        },
        editions: {
          orderBy: {
            publicationDate: "desc",
          },
          select: {
            id: true,
            language: true,
            publicationDate: true,
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

  function pickBestEdition(editions: EditionDto[]) {
    return editions.reduce((best, edition) => {
      // Todo: zmienic w bazie publicationDate wymagane
      if (best.publicationDate && edition.publicationDate) {
        return edition.publicationDate > best.publicationDate ? edition : best;
      }

      return edition;
    });
  }

  const items: BookCardDTO[] = books.map((b) => {
    // representative edition
    const best = pickBestEdition(b.editions);

    return {
      book: {
        id: b.id,
        title: b.title,
        slug: b.slug ?? "",
        authors: b.authors
          .sort((a, c) => (a.order ?? 0) - (c.order ?? 0))
          .map((a) => ({ id: a.person.id, name: a.person.name })),
        genres: b.genres.flatMap((g) =>
          g.genre.translations.map((t) => t.name),
        ),
        firstPublicationDate: b.firstPublicationDate
          ? b.firstPublicationDate
          : null,
        editions: b.editions,
      },
      representativeEdition: {
        id: best.id,
        language: best.language,
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
