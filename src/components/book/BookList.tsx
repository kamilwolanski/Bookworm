import { BookCard } from './BookCard';
import { UserBookDTO } from '@/lib/userbooks';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import { BookDTO } from '@/lib/books';
import { SearchBar } from '../shared/SearchBar';

type BookListProps = {
  books: UserBookDTO[] | BookDTO[];
  totalCount: number;
  pageSize: number;
  page: number;
};

export function BookList(props: BookListProps) {
  const { books, page, pageSize, totalCount } = props;

  console.log('books booklist', books)

  return (
    <div className="ms-16 flex flex-col min-h-[80vh] w-full">
      <SearchBar />
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 3xl:grid-cols-8 gap-5 3xl:gap-10">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>

      <PaginationWithLinks
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
      />
    </div>
  );
}
