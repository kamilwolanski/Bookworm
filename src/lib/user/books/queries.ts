import prisma from '@/lib/prisma';
import { EditionUserResponseItem, UserEditionData } from './types';

export async function getUserEditionData(
  userId: string,
  editionId: string
): Promise<UserEditionData> {
  const userEdition = await prisma.userBook.findFirst({
    where: {
      userId: userId,
      editionId: editionId,
    },
    select: {
      readingStatus: true,
    },
  });

  const userEditionReview = await prisma.review.findFirst({
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

  const bookRating = await prisma.book.findFirst({
    where: {
      editions: {
        some: {
          id: editionId,
        },
      },
    },
    select: {
      averageRating: true,
      ratingCount: true,
    },
  });

  return {
    editionId: editionId,
    isOnShelf: Boolean(userEdition),
    readingStatus: userEdition?.readingStatus ?? null,
    userReview: userEditionReview,
    rating: bookRating
      ? {
          averageRating: bookRating.averageRating,
          ratingCount: bookRating.ratingCount,
        }
      : undefined,
  };
}

export async function getTheUserInformationForEditions(
  userId: string,
  editionIds: string[]
): Promise<EditionUserResponseItem[]> {
  const editions = await prisma.edition.findMany({
    where: { id: { in: editionIds } },
    select: { id: true, bookId: true },
  });

  if (editions.length === 0) return [];

  const foundEditionIds = editions.map((e) => e.id);
  const foundBookIds = Array.from(new Set(editions.map((e) => e.bookId)));

  const [averageRatings, userReviews, userEditions] = await Promise.all([
    prisma.book.findMany({
      where: { id: { in: foundBookIds } },
      select: { id: true, averageRating: true, ratingCount: true },
    }),
    prisma.review.findMany({
      where: {
        editionId: { in: foundEditionIds },
        userId,
      },
      select: { editionId: true, rating: true },
    }),
    prisma.userBook.findMany({
      where: {
        bookId: { in: foundBookIds },
        userId,
      },
      select: {
        bookId: true,
        editionId: true,
      },
    }),
  ]);

  const userReviewsMap = new Map(userReviews.map((r) => [r.editionId, r]));
  const averageRatingsMap = new Map(averageRatings.map((ar) => [ar.id, ar]));
  const userEditionsMap = new Map<string, typeof userEditions>();
  for (const ub of userEditions) {
    const arr = userEditionsMap.get(ub.bookId);
    if (arr) arr.push(ub);
    else userEditionsMap.set(ub.bookId, [ub]);
  }

  const items: EditionUserResponseItem[] = editions.map((edition) => ({
    id: edition.id,
    bookId: edition.bookId,
    rating: averageRatingsMap.get(edition.bookId),
    userState: {
      userRating: userReviewsMap.get(edition.id)?.rating,
      userEditions: userEditionsMap.get(edition.bookId) ?? [],
    },
  }));

  return items;
}
