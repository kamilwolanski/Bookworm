import { GenreDTO } from '@/lib/books';
import GenreFilter from './GenreFilter';
import RatingFilter from './RatingFilter';

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
    </div>
  );
};

export default BookFilters;
