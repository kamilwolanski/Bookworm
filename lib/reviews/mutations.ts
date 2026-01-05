import prisma from '@/lib/prisma';
import { DeleteReviewPayload, RatePayload } from './types';

export async function updateBookRating(
  userId: string,
  { editionId, bookId, rating, body }: RatePayload
): Promise<void> {
  // walidacja: tylko jeśli rating został przekazany
  if (rating != null) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5.');
    }
  }

  await prisma.$transaction(async (tx) => {
    // Upsert recenzji użytkownika dla danej EDYCJI
    await tx.review.upsert({
      where: { userId_editionId: { userId, editionId } },
      create: { editionId, userId, rating, body },
      update: { rating, body },
    });

    // 🔧 Agregaty dla CAŁEJ KSIĄŻKI (po wszystkich edycjach)
    const aggs = await tx.review.aggregate({
      where: { edition: { bookId } }, // <— kluczowa zmiana
      _avg: { rating: true },
      _count: { rating: true }, // liczy tylko nie-NULL
    });

    const avg =
      aggs._avg.rating == null ? null : Number(aggs._avg.rating.toFixed(1));
    const count = aggs._count.rating;

    await tx.book.update({
      where: { id: bookId },
      data: {
        averageRating: avg, // możesz trzymać null gdy brak ocen
        ratingCount: count,
      },
    });
  });
}

export async function deleteReview(
  userId: string,
  { reviewId, bookId }: DeleteReviewPayload
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await prisma.review.delete({
      where: {
        id: reviewId,
        userId,
      },
    });
    const aggs = await tx.review.aggregate({
      where: { edition: { bookId } }, // <— kluczowa zmiana
      _avg: { rating: true },
      _count: { rating: true }, // liczy tylko nie-NULL
    });

    const avg =
      aggs._avg.rating == null ? null : Number(aggs._avg.rating.toFixed(1));
    const count = aggs._count.rating;

    await tx.book.update({
      where: { id: bookId },
      data: {
        averageRating: avg, // możesz trzymać null gdy brak ocen
        ratingCount: count,
      },
    });
  });
}
