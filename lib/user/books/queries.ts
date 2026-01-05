import prisma from "@/lib/prisma";
import {
  EditionUserResponseItem,
  UserBookStatus,
  UserEditionData,
} from "./types";

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

export async function getBookIdBySlug(bookSlug: string) {
  return await prisma.book.findUniqueOrThrow({
    where: {
      slug: bookSlug,
    },
    select: {
      id: true,
    },
  });
}

export async function getTheUserBookData(
  userId: string,
  bookId: string,
  editionId: string
): Promise<UserBookStatus> {
  const userBook = await prisma.userBook.findUnique({
    where: {
      bookId_userId_editionId: {
        userId: userId,
        editionId: editionId,
        bookId: bookId,
      },
    },
    select: {
      readingStatus: true,
    },
  });

  return {
    isOnShelf: Boolean(userBook),
    readingStatus: userBook?.readingStatus ?? null,
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

  const foundBookIds = Array.from(new Set(editions.map((e) => e.bookId)));

  const [userEditions] = await Promise.all([
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
      userEditions: userEditionsMap.get(edition.bookId) ?? [],
    },
  }));

  return items;
}

export async function getTheUserInformationForEdition(
  userId: string,
  editionId: string
): Promise<EditionUserResponseItem> {
  const edition = await prisma.edition.findFirstOrThrow({
    where: { id: editionId },
    select: { id: true, bookId: true },
  });

  const [userEditions] = await Promise.all([
    prisma.userBook.findMany({
      where: {
        bookId: edition.bookId,
        userId,
      },
      select: {
        bookId: true,
        editionId: true,
      },
    }),
  ]);

  const userEditionsMap = new Map<string, typeof userEditions>();
  for (const ub of userEditions) {
    const arr = userEditionsMap.get(ub.bookId);
    if (arr) arr.push(ub);
    else userEditionsMap.set(ub.bookId, [ub]);
  }

  const item: EditionUserResponseItem = {
    id: edition.id,
    bookId: edition.bookId,
    userState: {
      userEditions: userEditionsMap.get(edition.bookId) ?? [],
    },
  };

  return item;
}
