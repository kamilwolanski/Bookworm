import prisma from "@/lib/prisma";
import { CreateBookInput, UpdateBookData } from "./types";

export async function createBook(input: CreateBookInput) {
  const { slug, title, authorIds, genreIds, firstPublicationDate } = input;

  return await prisma.book.create({
    data: {
      slug,
      title,
      firstPublicationDate: firstPublicationDate,
      authors: {
        create: authorIds.map((personId, index) => ({
          order: index + 1,
          person: { connect: { id: personId } },
        })),
      },
      genres: {
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: {
      authors: { include: { person: true }, orderBy: { order: "asc" } },
      genres: { include: { genre: true } },
    },
  });
}

export async function updateBook(data: UpdateBookData) {
  const { id, slug, title, authorIds, genreIds, firstPublicationDate } = data;

  return await prisma.book.update({
    where: { id },
    data: {
      slug,
      title,
      firstPublicationDate,
      authors: {
        deleteMany: {},
        create: authorIds.map((personId, index) => ({
          order: index + 1,
          person: { connect: { id: personId } },
        })),
      },
      genres: {
        deleteMany: {},
        create: genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: {
      authors: { include: { person: true }, orderBy: { order: "asc" } },
      genres: { include: { genre: true } },
    },
  });
}

export async function deleteBook(bookId: string) {
  const book = await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return book;
}
