import prisma from '@/lib/prisma';
import { UserBookReview, UserReviewData } from './types';

export async function getTheUserInformationForReviews(
  userId: string,
  reviewIds: string[]
): Promise<UserReviewData[]> {
  const editions = await prisma.review.findMany({
    where: { id: { in: reviewIds } },
    select: {
      id: true,
      userId: true,
      votes: {
        where: {
          userId: userId,
        },
        select: {
          type: true,
        },
        take: 1,
      },
    },
  });

  return editions;
}

export async function getUserBookReviews(
  userId: string,
  bookId: string
): Promise<UserBookReview[]> {
  const userReviews = await prisma.review.findMany({
    where: {
      edition: {
        bookId: bookId,
      },
      userId: userId,
    },
    select: {
      editionId: true,
      rating: true,
      body: true,
    },
  });

  return userReviews;
}
