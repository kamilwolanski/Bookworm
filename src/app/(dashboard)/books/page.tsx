import { BookList } from '@/components/book/BookList';
import BookForm from '@/components/book/BookForm';
import { getBookGenres } from '@/lib/books';
import { getBooksAction } from './actions';
import { PaginationWithLinks } from '@/components/book/PaginationWithLinks';
import { SearchBar } from '@/components/book/SearchBar';

type Props = {
  searchParams?: {
    page?: string;
    search?: string;
  };
};

const ITEMS_PER_PAGE = 16;

export default async function Books({ searchParams }: Props) {
  const { page, search } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const response = await getBooksAction({
    currentPage: currentPage,
    booksPerPage: ITEMS_PER_PAGE,
    search,
  });
  const bookGenres = await getBookGenres('pl');

  if (!response.isError && response.data)
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex">
          <BookForm bookGenres={bookGenres} />
          <div className="ms-10 w-full">
            <SearchBar />
          </div>
        </div>
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
