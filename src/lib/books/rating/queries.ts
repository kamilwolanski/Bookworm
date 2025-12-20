import prisma from '@/lib/prisma';
import { BookRatingResponse } from './types';

export async function getBookRating(
  bookSlug: string
): Promise<BookRatingResponse | null> {
  const book = await prisma.book.findUnique({
    where: {
      slug: bookSlug,
    },
    select: {
      averageRating: true,
      ratingCount: true,
    },
  });

  if (!book) return null;

  return {
    averageRating: book.averageRating,
    ratingCount: book.ratingCount,
  };
}
