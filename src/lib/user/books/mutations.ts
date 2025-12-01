import prisma from '@/lib/prisma';
import { RemoveBookFromShelfPayload } from './types';
import { ReadingStatus, UserBook } from '@prisma/client';

export async function removeBookFromShelf(
  userId: string,
  { bookId, editionId }: RemoveBookFromShelfPayload
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
  { bookId, editionId }: { bookId: string; editionId: string }
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
  }: { bookId: string; editionId: string; readingStatus: ReadingStatus }
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
