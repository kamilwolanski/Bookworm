import { Book } from '@prisma/client';
import { GenreDTO } from '@/lib/books';

export type CreateBookInput = {
  slug: string;
  title: string;
  authorIds: string[];
  genreIds: string[];
  firstPublicationDate?: Date | null;
  description?: string | null;
};

export type UpdateBookData = {
  id: string;
  slug: string;
  title: string;
  authorIds: string[];
  genreIds: string[];
  firstPublicationDate?: Date | null;
  description?: string | null;
};

export type BookBasicDTO = Omit<
  Book,
  'averageRating' | 'ratingCount' | 'updatedAt' | 'title_search'
> & {
  genres: GenreDTO[];
  authors: {
    order: number | null;
    person: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
};