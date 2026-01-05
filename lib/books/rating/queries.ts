import prisma from "@/lib/prisma";
import { BookRatingResponse } from "./types";

export async function getBookRating(
  bookId: string
): Promise<BookRatingResponse> {
  const book = await prisma.book.findFirstOrThrow({
    where: {
      id: bookId
    },
    select: {
      averageRating: true,
      ratingCount: true,
    },
  });

  return {
    averageRating: book.averageRating,
    ratingCount: book.ratingCount ?? 0,
  };
}
