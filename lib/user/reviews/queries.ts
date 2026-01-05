import prisma from "@/lib/prisma";
import { UserBookReview, UserBookReviewVote, UserReviewData } from "./types";

export async function getUserEditionRating(userId: string, editionId: string) {
  return prisma.review.findFirst({
    where: {
      userId: userId,
      editionId: editionId,
    },
    select: {
      rating: true,
    },
  });
}

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
      id: true,
      editionId: true,
      rating: true,
      body: true,
    },
  });

  return userReviews;
}

export async function getUserBookRating(userId: string, editionId: string) {
  const userRating = await prisma.review.findFirst({
    where: {
      editionId: editionId,
      userId: userId,
    },
    select: {
      id: true,
      editionId: true,
      rating: true,
    }
  });

  return userRating
}

export async function getUserBookReview(
  userId: string,
  editionId: string
): Promise<UserBookReview | null> {
  const userReview = await prisma.review.findFirst({
    where: {
      editionId: editionId,
      userId: userId,
    },
    select: {
      id: true,
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
