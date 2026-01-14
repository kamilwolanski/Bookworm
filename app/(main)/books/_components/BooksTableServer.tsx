import BookList from "@/components/homepage/BookList";
import { PaginationWithLinks } from "@/components/shared/PaginationWithLinks";
import { getUserSession } from "@/lib/session";
import { getBooksAll } from "@/lib/userbooks";

import { ReadingStatus } from "@prisma/client";
import NoResults from "./NoResults";

type BooksTableProps = {
  searchParams:
    | Promise<{
        page?: string | undefined;
        search?: string | undefined;
        genre?: string | undefined;
        userrating?: string | undefined;
        rating?: string | undefined;
        status?: string | undefined;
        myshelf?: string | undefined;
      }>
    | undefined;
};
const ITEMS_PER_PAGE = 18;

export default async function BooksTable(props: BooksTableProps) {
  const { page, search, genre, userrating, status, myshelf, rating } =
    props.searchParams ? await props.searchParams : {};

  const currentPage = parseInt(page || "1", 10);
  const genresParams = genre?.toLocaleUpperCase().split(",") ?? [];
  const userRatings = userrating?.split(",") ?? [];
  const statuses = (status?.toUpperCase().split(",") as ReadingStatus[]) ?? {};
  const myShelf = Boolean(myshelf);
  const session = await getUserSession();
  const userId = session?.user?.id;
  const { items, totalCount } = await getBooksAll({
    currentPage,
    booksPerPage: ITEMS_PER_PAGE,
    genres: genresParams,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId,
  });

  return (
    <>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 gap-2 3xl:gap-10">
          <BookList books={items} />
        </div>
      ) : (
        <NoResults />
      )}
      <div className="pb-10 lg:pb-0">
        {totalCount > ITEMS_PER_PAGE && (
          <PaginationWithLinks
            page={currentPage}
            pageSize={ITEMS_PER_PAGE}
            totalCount={totalCount}
          />
        )}
      </div>
    </>
  );
}
