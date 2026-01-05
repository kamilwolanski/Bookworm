import { getUserSession } from "@/lib/session";
import { getBooksAll } from "@/lib/userbooks";
import { ReadingStatus } from "@prisma/client";

type Props = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    genre?: string;
    userrating?: string;
    rating?: string;
    status?: string;
    myshelf?: string;
  }>;
};

export default async function CountResults({ searchParams }: Props) {
  const { search, genre, userrating, status, myshelf, rating } =
    searchParams ? await searchParams : {};
  const genresParams = genre?.toLocaleUpperCase().split(",") ?? [];
  const userRatings = userrating?.split(",") ?? [];
  const statuses = (status?.toUpperCase().split(",") as ReadingStatus[]) ?? {};
  const myShelf = Boolean(myshelf);

  const session = await getUserSession();
  const userId = session?.user?.id;

  const { totalCount } = await getBooksAll({
    currentPage: 1,
    booksPerPage: 1,
    genres: genresParams,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId,
  });

  return <>{totalCount}</>;
}
