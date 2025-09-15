'use server';
import { GenreDTO } from '@/lib/userbooks';
import GenreFilter from './GenreFilter';
import RatingFilter from './RatingFilter';
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
      {logged && (
        <>
          <RatingFilter />
          {/* <StatusFilter /> */}
        </>
      )}
    </div>
  );
};

export default BookFilters;
