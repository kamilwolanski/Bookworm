import prisma from '@/lib/prisma';
import { BookDetailsDto, BookEditionMetaData, OtherEditionDto } from './types';

export async function getBook(editionId: string): Promise<BookDetailsDto> {
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
                    where: {
                      language: 'pl',
                    },
                    select: {
                      id: true,
                      genreId: true,
                      language: true,
                      name: true,
                    },
                    orderBy: { language: 'asc' },
                    take: 1,
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
  };
  return dto;
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

export async function findUniqueBook(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    select: { id: true },
  });

  return book;
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
