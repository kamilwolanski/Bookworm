import { GenreDTO } from '@/lib/userbooks';
import GenreFilter from './GenreFilter';
import RatingFilter from './RatingFilter';
import StatusFilter from './StatusFilter';

const BookFilters = ({
  bookGenres,
  genresParams,
}: {
  bookGenres: GenreDTO[];
  genresParams: string[];
}) => {
  return (
    <div className="min-w-100 max-w-100">
      <GenreFilter bookGenres={bookGenres} genresParams={genresParams} />
      <RatingFilter />
      <StatusFilter />
    </div>
  );
};

export default BookFilters;
