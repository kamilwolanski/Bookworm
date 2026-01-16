import prisma from '@/lib/prisma';
import { BookBasicDTO } from './types';


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

  return { books: booksDto, totalCount };
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
