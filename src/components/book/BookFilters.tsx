import { GenreDTO } from '@/lib/books';
import GenreFilter from './GenreFilter';

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
    </div>
  );
};

export default BookFilters;
