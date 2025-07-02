import { BookList } from '@/components/book/BookList';
import BookForm from '@/components/book/BookForm';
import { getBookGenres } from '@/lib/books';
import { getBooksAction } from './actions';
import { PaginationWithLinks } from '@/components/book/PaginationWithLinks';

type Props = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

const ITEMS_PER_PAGE = 16;

export default async function Books({ searchParams }: Props) {
  const { page } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const response = await getBooksAction({
    currentPage: currentPage,
    booksPerPage: ITEMS_PER_PAGE,
  });
  const bookGenres = await getBookGenres('pl');

  if (!response.isError && response.data)
    return (
      <div className="min-h-full flex flex-col">
        <BookForm bookGenres={bookGenres} />
        <div className="mt-10">
          <BookList books={response.data.books} />
        </div>
        <div className="mt-auto pt-20">
          {response.data.totalCount > ITEMS_PER_PAGE && (
            <PaginationWithLinks
              page={currentPage}
              pageSize={ITEMS_PER_PAGE}
              totalCount={response.data.totalCount}
            />
          )}
        </div>
      </div>
    );
}
