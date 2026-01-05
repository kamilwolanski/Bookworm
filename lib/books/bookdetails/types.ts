import { GenreTranslation, MediaFormat } from '@prisma/client';

export type BookDetailsDto = {
  edition: {
    id: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    isbn13?: string | null;
    isbn10?: string | null;
    language?: string | null;
    publicationDate?: Date | null;
    pageCount?: number | null;
    format?: MediaFormat | null;
    coverUrl?: string | null;
    coverPublicId?: string | null;
  };
  book: {
    id: string;
    slug: string;
    authors: { name: string; slug: string; order: number | null }[];
    genres: (Omit<GenreTranslation, 'name_search'> & { slug: string })[];
    ratingCount: number | null;
    averageRating: number | null;
  };
  publishers: {
    id: string;
    name: string;
    slug: string;
    order: number | null;
  }[];
};

export type BookEditionMetaData = {
  title: string | null;
  description: string | null;
};

export type OtherEditionDto = {
  id: string;
  coverUrl: string | null;
  title: string | null;
};
