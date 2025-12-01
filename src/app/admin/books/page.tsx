import AdminBooksTable from '@/components/admin/book/AdminBooksTable';
import AddBookDialog from '@/components/admin/book/AddBookDialog';
import { getAllBooksBasic } from '@/lib/adminBooks';
import { getBookGenres } from '@/lib/books';

type Props = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    genre?: string;
    rating?: string;
    status?: string;
  }>;
};

const ITEMS_PER_PAGE = 16;

export default async function BooksPage({ searchParams }: Props) {
  const { page, search, genre, rating } = searchParams
    ? await searchParams
    : {};
  const currentPage = parseInt(page || '1', 10);
  const genresParams = genre?.toLocaleUpperCase().split(',') ?? [];
  const ratings = rating?.split(',') ?? [];
  const response = await getAllBooksBasic(
    currentPage,
    ITEMS_PER_PAGE,
    genresParams,
    ratings,
    search
  );
  const bookGenres = await getBookGenres('pl');

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddBookDialog bookGenres={bookGenres} />
      </div>

      <div className="flex flex-1">
        <AdminBooksTable
          books={response.books}
          page={currentPage}
          pageSize={ITEMS_PER_PAGE}
          totalCount={response.totalCount}
          bookGenres={bookGenres}
        />
      </div>
    </div>
  );
}
