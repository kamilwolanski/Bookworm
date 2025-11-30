import prisma from '@/lib/prisma';
import { AuthorBooksResponse, AuthorDto, AuthorForSitemap } from './types';
import { BookCardDTO, EditionDto } from '../userbooks';

export async function getAuthor(authorSlug: string): Promise<AuthorDto> {
  const authorRaw = await prisma.person.findFirstOrThrow({
    where: { slug: authorSlug },
    select: {
      id: true,
      name: true,
      bio: true,
      birthDate: true,
      deathDate: true,
      imageUrl: true,
      nationality: true,
      _count: {
        select: {
          authoredBooks: true,
        },
      },
    },
  });

  const { _count, ...rest } = authorRaw;

  const author: AuthorDto = {
    ...rest,
    authoredBooksCount: _count.authoredBooks,
  };

  return author;
}

export async function getAuthorsBooks(
  authorSlug: string
): Promise<AuthorBooksResponse> {
  const where = {
    authors: {
      some: {
        person: {
          slug: authorSlug,
        },
      },
    },
  };
  const [authorbooks, totalCount] = await Promise.all([
    prisma.book.findMany({
      orderBy: {
        firstPublicationDate: 'desc',
      },
      where: where,
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
    prisma.book.count({ where }),
  ]);

  function pickBestEdition(editions: EditionDto[]) {
    return editions.reduce((best, edition) => {
      // Todo: zmienic w bazie publicationDate wymagane
      if (best.publicationDate && edition.publicationDate) {
        return edition.publicationDate > best.publicationDate ? edition : best;
      }

      return edition;
    });
  }

  const items: BookCardDTO[] = authorbooks.map((book) => {
    const representativeEdition = pickBestEdition(book.editions);

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
        id: representativeEdition.id,
        title: representativeEdition.title,
        subtitle: representativeEdition.subtitle,
        coverUrl: representativeEdition.coverUrl,
      },
      ratings: {
        bookAverage: book.averageRating ?? null,
        bookRatingCount: book.ratingCount ?? null,
      },
    };
  });

  return { authorbooks: items, totalCount };
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const authors = await prisma.person.findMany({ select: { slug: true } });
  return authors.map((a) => a.slug);
}

export async function getAllAuthorsForSitemap(): Promise<AuthorForSitemap[]> {
  return await prisma.person.findMany({
    where: {
      authoredBooks: {
        some: {},
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}
