import prisma from '@/lib/prisma';
import { Book } from '@prisma/client';
import { GenreDTO } from './userbooks';

export type CreateBookInput = {
  slug: string;
  title: string;
  authorIds: string[];
  genreIds: string[];
  firstPublicationDate?: Date | null;
  description?: string | null;
};

export type UpdateBookData = {
  id: string;
  slug: string;
  title: string;
  authorIds: string[];
  genreIds: string[];
  firstPublicationDate?: Date | null;
  description?: string | null;
};

export type BookBasicDTO = Omit<
  Book,
  'averageRating' | 'ratingCount' | 'updatedAt' | 'title_search'
> & {
  genres: GenreDTO[];
  authors: {
    order: number | null;
    person: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
};

export async function createBook(input: CreateBookInput) {
  const { slug, title, authorIds, genreIds, firstPublicationDate } = input;

  return await prisma.book.create({
    data: {
      slug,
      title,
      firstPublicationDate: firstPublicationDate,
      authors: {
        create: authorIds.map((personId, index) => ({
          order: index + 1,
          person: { connect: { id: personId } },
        })),
      },
      genres: {
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: {
      authors: { include: { person: true }, orderBy: { order: 'asc' } },
      genres: { include: { genre: true } },
    },
  });
}

export async function updateBook(data: UpdateBookData) {
  const { id, slug, title, authorIds, genreIds, firstPublicationDate } = data;

  return await prisma.book.update({
    where: { id },
    data: {
      slug,
      title,
      firstPublicationDate,
      authors: {
        deleteMany: {},
        create: authorIds.map((personId, index) => ({
          order: index + 1,
          person: { connect: { id: personId } },
        })),
      },
      genres: {
        deleteMany: {},
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: {
      authors: { include: { person: true }, orderBy: { order: 'asc' } },
      genres: { include: { genre: true } },
    },
  });
}

export async function getAllBooksBasic(
  currentPage: number,
  booksPerPage: number,
  genres: string[],
  ratings: string[],
  search?: string
): Promise<{
  books: BookBasicDTO[];
  totalCount: number;
}> {
  const skip = (currentPage - 1) * booksPerPage;

  const searchConditions = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
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
          // wyszukiwanie po nazwie gatunku (PL)
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
  };

  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      skip,
      take: booksPerPage,
      where,
      orderBy: { addedAt: 'desc' },
      select: {
        id: true,
        title: true,
        addedAt: true,
        firstPublicationDate: true,
        slug: true,
        // ✅ zawęź select autorów do potrzebnych pól
        authors: {
          orderBy: { order: 'asc' },
          select: {
            order: true,
            person: { select: { id: true, name: true, slug: true } },
          },
        },
        genres: {
          include: {
            genre: {
              include: {
                translations: {
                  where: { language: 'pl' },
                  select: { language: true, name: true },
                },
              },
            },
          },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  const booksDto: BookBasicDTO[] = books.map((book) => {
    const genresDto = book.genres.map((gr) => {
      const t = gr.genre.translations[0];
      return {
        id: gr.genre.id,
        slug: gr.genre.slug,
        language: t?.language ?? 'pl',
        name: t?.name ?? gr.genre.slug,
      };
    });
    return {
      ...book,
      genres: genresDto,
    };
  });
  console.log('booksDto', booksDto);

  return { books: booksDto, totalCount };
}

export async function deleteBook(bookId: string) {
  const book = await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return book;
}

export async function getBookBySlug(slug: string) {
  const book = await prisma.book.findFirstOrThrow({
    where: {
      slug,
    },
    select: {
      id: true,
      title: true,
    },
  });

  return book;
}
