import { BookList } from '@/components/book/BookList';
import BookForm from '@/components/book/BookForm';
import { getBookGenres } from '@/lib/userbooks';
import { SearchBar } from '@/components/shared/SearchBar';
import BookFilters from '@/components/book/BookFilters';
import { GenreSlug } from '@prisma/client';
import { getAllBooksAction } from '@/app/(public)/books/actions/bookActions';

type Props = {
  searchParams?: {
    page?: string;
    search?: string;
    genre?: string;
    rating?: string;
    status?: string;
  };
};

const ITEMS_PER_PAGE = 16;

export default async function Books({ searchParams }: Props) {
  const { page, search, genre, rating } = searchParams
    ? await searchParams
    : {};
  const currentPage = parseInt(page || '1', 10);
  const genresParams =
    (genre?.toLocaleUpperCase().split(',') as GenreSlug[]) ?? [];
  const ratings = rating?.split(',') ?? [];
  const response = await getAllBooksAction({
    currentPage: currentPage,
    booksPerPage: ITEMS_PER_PAGE,
    search,
    genres: genresParams,
    ratings,
  });
  const bookGenres = await getBookGenres('pl');
  console.log('responses', response);
  if (!response.isError && response.data)
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex">
          <BookForm bookGenres={bookGenres} />
          <div className="ms-10 w-full">
            <SearchBar />
          </div>
        </div>

        <div className="mt-10 flex flex-1">
          <BookFilters bookGenres={bookGenres} genresParams={genresParams} />
          <BookList
            books={response.data.books}
            page={currentPage}
            pageSize={ITEMS_PER_PAGE}
            totalCount={response.data.totalCount}
          />
        </div>
      </div>
    );
}
