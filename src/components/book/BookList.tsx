import { BookCard } from './BookCard';
import { BookWithUserDataAndDisplay } from '@/lib/userbooks';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import { SearchBar } from '../shared/SearchBar';
import ShelfSwitch from '@/components/book/ShelfSwitch';
import { getUserSession } from '@/lib/session';
import NoResults from '@/components/states/NoResults';

type BookListProps = {
  books: BookWithUserDataAndDisplay[];
  totalCount: number;
  pageSize: number;
  page: number;
};

export async function BookList(props: BookListProps) {
  const { books, page, pageSize, totalCount } = props;
  const session = await getUserSession();

  return (
    <div className="ms-16 flex flex-col min-h-[80vh] w-full">
      <div className="flex items-center mb-10 gap-3">
        <SearchBar placeholder="Wyszukaj książkę" />
        {session && <ShelfSwitch />}
      </div>
      {books.length > 0 ? (
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 3xl:grid-cols-6 gap-5 3xl:gap-14 ">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <NoResults />
        </div>
      )}

      {books.length > 0 && (
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}
