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

  const userEditionRating = await prisma.review.findFirst({
    where: {
      editionId: editionId,
      userId: userId,
    },
    select: {
      rating: true,
    },
  });

  return {
    isOnShelf: Boolean(userEdition),
    readingStatus: userEdition?.readingStatus ?? null,
    userRating: userEditionRating?.rating ?? null,
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

  const [userReviews, userEditions] = await Promise.all([
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

  const userEditionsMap = new Map<string, typeof userEditions>();
  for (const ub of userEditions) {
    const arr = userEditionsMap.get(ub.bookId);
    if (arr) arr.push(ub);
    else userEditionsMap.set(ub.bookId, [ub]);
  }

  const items: EditionUserResponseItem[] = editions.map((edition) => ({
    id: edition.id,
    bookId: edition.bookId,
    userState: {
      userRating: userReviewsMap.get(edition.id)?.rating,
      userEditions: userEditionsMap.get(edition.bookId) ?? [],
    },
  }));

  return items;
}
