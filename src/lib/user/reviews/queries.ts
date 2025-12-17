import prisma from '@/lib/prisma';
import { UserBookReview, UserBookReviewVote, UserReviewData } from './types';

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

export async function getUserBookReview(
  userId: string,
  bookId: string,
  editionId: string
): Promise<UserBookReview> {
  const userReview = await prisma.review.findFirstOrThrow({
    where: {
      editionId: editionId,
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

  return userReview;
}

export async function getUserBookReviewsVotes(
  userId: string,
  reviewIds: string[]
): Promise<UserBookReviewVote[]> {
  const userVotes = await prisma.reviewVote.findMany({
    where: {
      reviewId: {
        in: reviewIds,
      },
      userId: userId,
    },
    select: {
      reviewId: true,
      type: true,
    },
  });

  const userVotesMap = new Map(userVotes.map((vote) => [vote.reviewId, vote]));

  return reviewIds.map((id) => {
    return {
      reviewId: id,
      type: userVotesMap.get(id)?.type ?? null,
    };
  });
}
