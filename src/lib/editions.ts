import prisma from '@/lib/prisma';
import { Edition } from '@prisma/client';

export type CreateEditionData = Omit<
  Edition,
  'id' | 'createdAt' | 'updatedAt'
> & {
  publisherIds: string[];
};

export async function createEdition(data: CreateEditionData) {
  const {
    title,
    publicationDate,
    publisherIds,
    pageCount,
    coverUrl,
    coverPublicId,
    isbn10,
    isbn13,
    bookId,
    language,
    format,
    subtitle,
  } = data;

  return await prisma.edition.create({
    data: {
      bookId: bookId,
      title: title,
      subtitle: subtitle,
      format: format,
      publicationDate: publicationDate,
      pageCount: pageCount,
      coverUrl: coverUrl,
      coverPublicId: coverPublicId,
      isbn10: isbn10,
      isbn13: isbn13,
      language,
      publishers: {
        create: publisherIds.map((publisherId, index) => ({
          order: index + 1,
          publisher: { connect: { id: publisherId } },
        })),
      },
    },
    include: {
      publishers: { include: { publisher: true }, orderBy: { order: 'asc' } },
    },
  });
}

export async function getAllEditionsBasic(bookId: string) {
  return prisma.edition.findMany({
    where: {
      bookId: bookId,
    },
  });
}
