import prisma from '@/lib/prisma';
import { BookEditionForSitemap } from './types';

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

export async function getAllBookStaticParams(): Promise<
  {
    slug: string;
    editionId: string;
  }[]
> {
  const books = await prisma.book.findMany({
    select: {
      slug: true,
      editions: {
        select: {
          id: true,
        },
      },
    },
  });
  return books.flatMap((book) =>
    book.editions.map((edition) => {
      return {
        slug: book.slug,
        editionId: edition.id,
      };
    })
  );
}
