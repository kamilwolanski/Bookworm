import { BookCard } from './BookCard';
import { BookCardDTO } from '@/lib/userbooks';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import NoResults from '@/components/states/NoResults';

type BookListProps = {
  bookItems: BookCardDTO[];
  totalCount: number;
  pageSize: number;
  page: number;
};

export async function BookList(props: BookListProps) {
  const { bookItems, page, pageSize, totalCount } = props;

  return (
    <>
      {bookItems.length > 0 ? (
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 gap-2 3xl:gap-10 ">
            {bookItems.map((item) => (
              <BookCard key={item.book.id} bookItem={item} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <NoResults />
        </div>
      )}

      {bookItems.length > 0 && (
        <PaginationWithLinks
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      )}
    </>
  );
}
