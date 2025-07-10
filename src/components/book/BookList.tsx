import { BookCard } from './BookCard';
import { BookDetailsDTO } from '@/lib/books';

export function BookList({ books }: { books: BookDetailsDTO[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 3xl:grid-cols-8 gap-5 3xl:gap-10">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
