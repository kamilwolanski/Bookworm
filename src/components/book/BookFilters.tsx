'use server';
import { GenreDTO } from '@/lib/userbooks';
import GenreFilter from './GenreFilter';
// import UserRatingFilter from './UserRatingFilter';
import RatingFilter from '@/components/book/RatingFilter';
// import StatusFilter from './StatusFilter';
import { getUserSession } from '@/lib/session';

const BookFilters = async ({
  bookGenres,
  genresParams,
}: {
  bookGenres: GenreDTO[];
  genresParams: string[];
}) => {
  const session = await getUserSession();
  const logged = !!session;

  return (
    <div className="min-w-100 max-w-100">
      <GenreFilter bookGenres={bookGenres} genresParams={genresParams} />
      <RatingFilter />
      {logged && (
        <>
          {/* <UserRatingFilter /> */}
          {/* <StatusFilter /> */}
        </>
      )}
    </div>
  );
};

export default BookFilters;
