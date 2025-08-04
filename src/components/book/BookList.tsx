import { BookCard } from './BookCard';
import { UserBookDTO } from '@/lib/userbooks';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import { BookDTO } from '@/lib/books';

type BookListProps = {
  books: UserBookDTO[] | BookDTO[];
  totalCount: number;
  pageSize: number;
  page: number;
};

export function BookList(props: BookListProps) {
  const { books, page, pageSize, totalCount } = props;
  return (
    <div className="ms-16 flex flex-col flex-1 justify-between">
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 3xl:grid-cols-8 gap-5 3xl:gap-10">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <div className="pt-20">
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
