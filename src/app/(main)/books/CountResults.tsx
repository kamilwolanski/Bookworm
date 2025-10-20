'use server';

import { getBooksAll } from '@/lib/userbooks';
import { ReadingStatus } from '@prisma/client';

type Props = {
  params: {
    genresParams: string[];
    myShelf: boolean;
    userRatings: string[];
    statuses: ReadingStatus[];
    rating?: string;
    search?: string;
    userId?: string;
  };
};

export default async function CountResults({ params }: Props) {
  const {
    genresParams,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId,
  } = params;

  const { totalCount } = await getBooksAll({
    currentPage: 1,
    booksPerPage: 1,
    genres: genresParams,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId,
  });

  return <>{totalCount}</>;
}
