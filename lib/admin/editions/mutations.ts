import prisma from '@/lib/prisma';
import { CreateEditionData, UpdateEditionData } from './types';

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
    description,
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
      description: description,
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
    description,
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
      description: description,
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



export async function deleteEdition(editionId: string) {
  const book = await prisma.edition.delete({
    where: {
      id: editionId,
    },
  });

  return book;
}
