import prisma from '@/lib/prisma';
import { Edition, EditionPublisher } from '@prisma/client';

export type CreateEditionData = Omit<
  Edition,
  'id' | 'createdAt' | 'updatedAt'
> & {
  publisherIds: string[];
};
export type UpdateEditionData = Omit<Edition, 'createdAt' | 'updatedAt'> & {
  publisherIds: string[];
};

export type EditionDto = Edition & {
  publishers: EditionPublisher[];
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

export async function updateEdition(data: UpdateEditionData) {
  const {
    id,
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

  return await prisma.edition.update({
    where: {
      id,
    },
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
        deleteMany: {},
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
    include: {
      publishers: true,
    },
  });
}

export async function getEdition(editionId: string) {
  return prisma.edition.findFirst({
    where: {
      id: editionId,
    },
    select: {
      id: true,
      coverPublicId: true,
      book: {
        select: {
          slug: true,
        },
      },
    },
  });
}

export async function deleteEdition(editionId: string) {
  const book = await prisma.edition.delete({
    where: {
      id: editionId,
    },
  });

  return book;
}
