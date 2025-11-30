import { BookCardDTO } from '../userbooks';

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

export type AuthorForSitemap = {
  slug: string;
  updatedAt: Date;
};

export type AuthorBooksResponse = {
  authorbooks: BookCardDTO[];
  totalCount: number;
};
