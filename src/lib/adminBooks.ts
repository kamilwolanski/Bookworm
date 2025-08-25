import prisma from '@/lib/prisma';

export type CreateBookInput = {
  slug: string;
  title: string;
  authorIds: string[];
  genreIds: string[];
  firstPublicationDate?: Date | null;
  description?: string | null;
};

export async function createBook(input: CreateBookInput) {
  const {
    slug,
    title,
    authorIds,
    genreIds,
    firstPublicationDate,
    description,
  } = input;

  console.log('input', input);

  return await prisma.book.create({
    data: {
      slug,
      title,
      description: description ?? undefined,
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
      authors: { include: { person: true }, orderBy: { order: 'asc' } },
      genres: { include: { genre: true } },
    },
  });
}
