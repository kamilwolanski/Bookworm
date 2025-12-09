import { ReviewVoteType } from '@prisma/client';
import prisma from '../prisma';
import { ReviewVotesCount } from './types';

export async function upsertReviewVote(
  userId: string,
  { reviewId, type }: { reviewId: string; type: ReviewVoteType }
): Promise<{ removed: boolean; currentType?: ReviewVoteType }> {
  // 1) Sprawdź właściciela opinii (nie można głosować na siebie)
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
  });

  if (!review) {
    // możesz też zwrócić 404 w akcjach, jeśli chcesz
    throw new Error('Review not found');
  }

  const existing = await prisma.reviewVote.findUnique({
    where: { reviewId_userId: { reviewId, userId } },
  });

  if (existing) {
    if (existing.type === type) {
      // toggle: ten sam typ -> usuń głos
      await prisma.reviewVote.delete({
        where: { reviewId_userId: { reviewId, userId } },
      });
      return { removed: true };
    }
    // zmiana typu
    const updated = await prisma.reviewVote.update({
      where: { reviewId_userId: { reviewId, userId } },
      data: { type },
    });
    return { removed: false, currentType: updated.type };
  }

  // 3) Brak głosu -> utwórz
  const created = await prisma.reviewVote.create({
    data: { reviewId, userId, type },
  });

  return { removed: false, currentType: created.type };
}

export async function getReviewsVotes(
  reviewIds: string[]
): Promise<ReviewVotesCount[]> {
  const grouped = await prisma.reviewVote.groupBy({
    by: ['reviewId', 'type'],
    where: {
      reviewId: { in: reviewIds },
    },
    _count: {
      type: true,
    },
  });

  const result = reviewIds.map((id) => ({
    reviewId: id,
    likes:
      grouped.find((g) => g.reviewId === id && g.type === 'LIKE')?._count
        .type ?? 0,
    dislikes:
      grouped.find((g) => g.reviewId === id && g.type === 'DISLIKE')?._count
        .type ?? 0,
  }));

  return result;
}
