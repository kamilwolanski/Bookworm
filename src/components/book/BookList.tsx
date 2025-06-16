import { Book } from '@prisma/client';
import { BookCard } from './BookCard';

export function BookList({ books }: { books: Book[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 3xl:grid-cols-6 gap-5 3xl:gap-12">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
