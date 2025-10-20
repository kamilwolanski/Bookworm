import { BookList } from '@/components/book/BookList';
import { getUserSession } from '@/lib/session';
import { getBooksAll } from '@/lib/userbooks';

type AuthorBooksProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
  authorSlug: string;
};

const ITEMS_PER_PAGE = 8;

const AuthorBooks = async ({ searchParams, authorSlug }: AuthorBooksProps) => {
  const session = await getUserSession();
  const userId = session?.user?.id;
  const { page } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const { items, totalCount } = await getBooksAll({
    currentPage,
    booksPerPage: ITEMS_PER_PAGE,
    genres: [],
    myShelf: false,
    userRatings: [],
    statuses: [],
    userId,
    authorSlug,
  });
  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
      <h3 className="font-semibold mb-6">Książki autora</h3>
      <BookList
        bookItems={items}
        page={currentPage}
        pageSize={ITEMS_PER_PAGE}
        totalCount={totalCount}
        gridColsClassNames="gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:gap-10"
      />
    </div>
  );
};

export default AuthorBooks;
