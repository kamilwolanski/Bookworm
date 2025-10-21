import prisma from '@/lib/prisma';
export type AuthorDto = {
  id: string;
  name: string;
  bio: string | null;
  imageUrl: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  nationality: string | null;
  authoredBooksCount: number;
};

type AuthorForSitemap = {
  slug: string;
  updatedAt: Date;
};

export async function getAuthor(authorSlug: string): Promise<AuthorDto> {
  const authorRaw = await prisma.person.findFirstOrThrow({
    where: { slug: authorSlug },
    select: {
      id: true,
      name: true,
      bio: true,
      birthDate: true,
      deathDate: true,
      imageUrl: true,
      nationality: true,
      _count: {
        select: {
          authoredBooks: true,
        },
      },
    },
  });

  const { _count, ...rest } = authorRaw;

  const author: AuthorDto = {
    ...rest,
    authoredBooksCount: _count.authoredBooks,
  };

  return author;
}

export async function getAllAuthorSlugs(): Promise<string[]> {
  const authors = await prisma.person.findMany({ select: { slug: true } });
  return authors.map((a) => a.slug);
}

export async function getAllAuthorsForSitemap(): Promise<AuthorForSitemap[]> {
  return await prisma.person.findMany({
    where: {
      authoredBooks: {
        some: {},
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}
