import prisma from "@/lib/prisma";
import { AddBookToShelfPayload, RemoveBookFromShelfPayload } from "./types";
import { ReadingStatus, UserBook } from "@prisma/client";

export async function removeBookFromShelf(
  userId: string,
  { bookId, editionId }: RemoveBookFromShelfPayload,
): Promise<void> {
  await prisma.userBook.delete({
    where: {
      bookId_userId_editionId: {
        userId,
        bookId,
        editionId,
      },
    },
  });
}

export async function addBookToShelf(
  userId: string,
  { bookId, editionId }: { bookId: string; editionId: string },
): Promise<UserBook> {
  return await prisma.userBook.create({
    data: {
      bookId,
      editionId,
      userId,
    },
  });
}

export async function changeBookStatus(
  userId: string,
  {
    bookId,
    editionId,
    readingStatus,
  }: { bookId: string; editionId: string; readingStatus: ReadingStatus },
): Promise<UserBook> {
  return await prisma.userBook.update({
    where: {
      bookId_userId_editionId: {
        bookId,
        userId,
        editionId,
      },
    },
    data: {
      readingStatus,
    },
  });
}

export async function addBookToShelfWithReview(
  userId: string,
  { bookId, editionId, readingStatus, rating, body }: AddBookToShelfPayload,
): Promise<void> {
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    throw new Error("Rating must be between 1 and 5.");
  }

  await prisma.$transaction(async (tx) => {
    const ub = await tx.userBook.create({
      data: {
        bookId,
        editionId,
        userId,
        readingStatus,
      },
    });

    if (rating || body) {
      await tx.review.upsert({
        where: {
          userId_editionId: { userId, editionId },
        },
        create: { editionId, userId, rating, body },
        update: { rating, body },
      });

      const aggs = await tx.review.aggregate({
        where: { editionId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const avg = Number((aggs._avg.rating ?? 0).toFixed(1));
      const count = aggs._count.rating;

      await tx.book.update({
        where: { id: bookId },
        data: {
          averageRating: avg,
          ratingCount: count,
        },
      });
    }

    return ub;
  });
}
