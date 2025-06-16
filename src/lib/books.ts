import { Book } from '@prisma/client';
import prisma from './prisma';
import { getUserSession } from './session';

export type CreateBookData = Omit<Book, 'id' | 'createdAt'>;

export async function createBook(data: CreateBookData) {
  return prisma.book.create({ data });
}
export async function getBooks() {
  const session = await getUserSession();
  const books = prisma.book.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return books;
}

export async function deleteBook(bookId: string) {
  const book = await prisma.book.delete({
    where: {
      id: bookId,
    },
  });

  return book;
}

export async function getBook(bookId: string) {
  const book = await prisma.book.findFirst({
    where: {
      id: bookId,
    },
  });

  return book;
}
