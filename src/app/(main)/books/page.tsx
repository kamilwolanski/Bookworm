import { BookList } from '@/components/book/BookList';
import { getBookGenres } from '@/lib/userbooks';
import { getBooksAction } from '@/app/(main)/books/actions/bookActions';
import BookFilters from '@/components/book/BookFilters';
import { GenreSlug, ReadingStatus } from '@prisma/client';

type Props = {
  searchParams?: {
    page?: string;
    search?: string;
    genre?: string;
    rating?: string;
    status?: string;
    myshelf?: string;
  };
};

const ITEMS_PER_PAGE = 18;

export default async function ShelfBooks({ searchParams }: Props) {
  const { page, search, genre, rating, status, myshelf } = searchParams
    ? await searchParams
    : {};
  const currentPage = parseInt(page || '1', 10);
  const genresParams =
    (genre?.toLocaleUpperCase().split(',') as GenreSlug[]) ?? [];
  const ratings = rating?.split(',') ?? [];
  const statuses = (status?.toUpperCase().split(',') as ReadingStatus[]) ?? {};
  const myShelf = !!myshelf;

  const response = await getBooksAction({
    currentPage: currentPage,
    booksPerPage: ITEMS_PER_PAGE,
    search,
    genres: genresParams,
    myShelf,
    ratings,
    statuses,
  });
  console.log('response', response);
  const bookGenres = await getBookGenres('pl');

  if (!response.isError && response.data)
    return (
      <div className="min-h-full flex flex-col">
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
