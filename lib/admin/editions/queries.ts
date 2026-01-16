import prisma from '@/lib/prisma';


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