import { Publisher } from '@prisma/client';

export type EditionDto = {
  id: string;
  language: string | null;
  publicationDate: Date | null;
  title: string | null;
  subtitle: string | null;
  coverUrl: string | null;
  publishers: {
    editionId: string;
    order: number | null;
    publisher: Publisher;
    publisherId: string;
  }[];
};

export type BookCardDTO = {
  book: {
    id: string;
    title: string;
    slug: string;
    authors: { id: string; name: string }[];
    editions: EditionDto[];
  };
  representativeEdition: {
    id: string;
    title: string | null;
    subtitle: string | null;
    coverUrl: string | null;
  };
  ratings: {
    bookAverage: number | null;
    bookRatingCount: number | null;
  };
};

export interface RatingFilter {
  editions?:
    | {
        some: {
          reviews: {
            some: {
              userId: string;
              rating: {
                in: number[];
              };
            };
          };
        };
      }
    | {
        none: {
          reviews: {
            some: {
              userId: string;
            };
          };
        };
      };
}



export type GetBooksAllResponse = {
  items: BookCardDTO[];
  totalCount: number;
};
