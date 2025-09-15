import { BookList } from '@/components/book/BookList';
import { redirect } from 'next/navigation';
import { getBookGenres, getBooksAll } from '@/lib/userbooks';
import { getBooksAction } from '@/app/(main)/books/actions/bookActions';
import { getUserSession } from '@/lib/session';
import BookFilters from '@/components/book/BookFilters';
import { ReadingStatus } from '@prisma/client';
import { MyFirstStepper } from '@/components/MyFirstStepper';

type Props = {
  searchParams?: {
    page?: string;
    search?: string;
    genre?: string;
    userrating?: string;
    status?: string;
    myshelf?: string;
  };
};

const ITEMS_PER_PAGE = 18;

export default async function ShelfBooks({ searchParams }: Props) {
  const { page, search, genre, userrating, status, myshelf } = searchParams
    ? await searchParams
    : {};
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
    search,
    userId
  );

  console.log('bboks', items);
  // const response = await getBooksAction({
  //   currentPage: currentPage,
  //   booksPerPage: ITEMS_PER_PAGE,
  //   search,
  //   genres: genresParams,
  //   myShelf,
  //   userRatings,
  //   statuses,
  // });
  const bookGenres = await getBookGenres('pl');

  return (
    <div className="min-h-full flex flex-col">
      <div className="mt-5 flex flex-1">
        <BookFilters bookGenres={bookGenres} genresParams={genresParams} />
        <BookList
          bookItems={items}
          page={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalCount={totalCount}
        />
      </div>
      {/* <MyFirstStepper /> */}
    </div>
  );
}
