import { getUserSession } from '@/lib/session';
import { getBooksAll } from '@/lib/userbooks';
import { ReadingStatus } from '@prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') ?? undefined;
  const genre = searchParams.get('genre');
  const userrating = searchParams.get('userrating');
  const rating = searchParams.get('rating') ?? undefined;
  const status = searchParams.get('status');
  const myshelf = searchParams.get('myshelf');

  const genres = genre?.toUpperCase().split(',') ?? [];
  const userRatings = userrating?.split(',') ?? [];
  const statuses =
    (status?.toUpperCase().split(',') as ReadingStatus[]) ?? [];
  const myShelf = Boolean(myshelf);

  const session = await getUserSession();
  const userId = session?.user?.id;

  const books = await getBooksAll({
    currentPage: 1,
    booksPerPage: 1,
    genres,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId,
  });

  return Response.json({ ...books });
}
