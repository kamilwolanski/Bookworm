import { EditionContributorRole, GenreSlug, MediaFormat } from '@prisma/client';
import prisma from './prisma';

export type CreateEditionInput = {
  language: string; // 'pl' | 'en' ...
  publicationDate?: Date | string;
  format?: MediaFormat;
  isbn13?: string;
  isbn10?: string;
  pageCount?: number;
  coverUrl?: string;
  publisherName?: string;
  contributors?: Array<{
    role: EditionContributorRole;
    name: string;
    sortName?: string;
    order?: number;
  }>;
};

async function findOrCreatePerson(name: string, sortName?: string) {
  const existing = await prisma.person.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.person.create({
    data: { name, sortName },
    select: { id: true },
  });
  return created.id;
}

export async function createBookWithEditions(params: {
  title: string;
  description?: string;
  firstPublicationDate?: Date | string;
  authors: Array<{ name: string; sortName?: string }>;
  genres?: GenreSlug[];
  editions?: CreateEditionInput[];
}) {
  return await prisma.$transaction(async (tx) => {
    // 1) Book
    const book = await tx.book.create({
      data: {
        title: params.title,
        description: params.description,
        firstPublicationDate: params.firstPublicationDate
          ? new Date(params.firstPublicationDate)
          : null,
      },
      select: { id: true, title: true },
    });

    // 2) Autorzy (BookAuthor) z kolejnością
    for (let i = 0; i < params.authors.length; i++) {
      const a = params.authors[i];
      const personId = await findOrCreatePerson(a.name, a.sortName);
      await tx.bookAuthor.create({
        data: { bookId: book.id, personId, order: i + 1 },
      });
    }

    // 3) Gatunki (opcjonalnie)
    if (params.genres?.length) {
      const genres = await tx.genre.findMany({
        where: { slug: { in: params.genres } },
        select: { id: true },
      });
      if (genres.length) {
        await tx.bookGenre.createMany({
          data: genres.map((g) => ({ bookId: book.id, genreId: g.id })),
          skipDuplicates: true,
        });
      }
    }

    // 4) Wydania (opcjonalnie)
    for (const ed of params.editions ?? []) {
      // publisher connectOrCreate (po name)
      let publisherConnect = undefined as
        | { connect: { id: string } }
        | {
            connectOrCreate: {
              where: { name: string };
              create: { name: string };
            };
          }
        | undefined;

      if (ed.publisherName) {
        publisherConnect = {
          connectOrCreate: {
            where: { name: ed.publisherName },
            create: { name: ed.publisherName },
          },
        };
      }

      const edition = await tx.edition.create({
        data: {
          bookId: book.id,
          language: ed.language,
          publicationDate: ed.publicationDate
            ? new Date(ed.publicationDate)
            : null,
          format: ed.format,
          isbn13: ed.isbn13 || null,
          isbn10: ed.isbn10 || null,
          pageCount: ed.pageCount ?? null,
          coverUrl: ed.coverUrl ?? null,
          ...(publisherConnect ?? {}),
        },
        select: { id: true },
      });

      // contributorzy wydania (np. tłumacz/ilustrator/lektor)
      for (let i = 0; i < (ed.contributors?.length ?? 0); i++) {
        const c = ed.contributors![i];
        const personId = await findOrCreatePerson(c.name, c.sortName);
        await tx.editionContributor.create({
          data: {
            editionId: edition.id,
            personId,
            role: c.role,
            order: c.order ?? i + 1,
          },
        });
      }
    }

    return book;
  });
}
