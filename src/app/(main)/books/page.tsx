import { BookList } from '@/components/book/BookList';
import { redirect } from 'next/navigation';
import { getBookGenres, getBooksAll } from '@/lib/userbooks';
import { getUserSession } from '@/lib/session';
import BookFilters from '@/components/book/BookFilters';
import { ReadingStatus } from '@prisma/client';

type Props = {
  searchParams?: {
    page?: string;
    search?: string;
    genre?: string;
    userrating?: string;
    rating?: string;
    status?: string;
    myshelf?: string;
  };
};

const ITEMS_PER_PAGE = 18;

export default async function ShelfBooks({ searchParams }: Props) {
  const { page, search, genre, userrating, status, myshelf, rating } =
    searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const genresParams = genre?.toLocaleUpperCase().split(',') ?? [];
  const userRatings = userrating?.split(',') ?? [];
  const statuses = (status?.toUpperCase().split(',') as ReadingStatus[]) ?? {};
  const myShelf = Boolean(myshelf);

  const session = await getUserSession();
  const userId = session?.user?.id;

  if (myShelf && !userId) {
    redirect('/login'); // albo wyświetl 401
  }

  const { items, totalCount } = await getBooksAll(
    currentPage,
    ITEMS_PER_PAGE,
    genresParams,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId
  );

  const bookGenres = await getBookGenres('pl');

  return (
    <div className="min-h-full flex flex-col ">
      <div className="mt-5 flex flex-1">
        <BookFilters bookGenres={bookGenres} genresParams={genresParams} />
        <BookList
          bookItems={items}
          page={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
