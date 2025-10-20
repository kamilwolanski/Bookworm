'use server';
import { getBooksAll } from '@/lib/userbooks';
import { BookList } from '@/components/book/BookList';
import { ReadingStatus } from '@prisma/client';

type BooksTableProps = {
  currentPage: number;
  itemsPerPage: number;
  userId?: string;
  params: {
    genresParams: string[];
    myShelf: boolean;
    userRatings: string[];
    statuses: ReadingStatus[];
    rating?: string;
    search?: string;
  };
};

export default async function BooksTable(props: BooksTableProps) {
  const {
    currentPage,
    itemsPerPage,
    userId,
    params: { genresParams, myShelf, userRatings, statuses, rating, search },
  } = props;

  const { items, totalCount } = await getBooksAll({
    currentPage,
    booksPerPage: itemsPerPage,
    genres: genresParams,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId,
  });

  return (
    <BookList
      bookItems={items}
      page={currentPage}
      pageSize={itemsPerPage}
      totalCount={totalCount}
    />
  );
}
