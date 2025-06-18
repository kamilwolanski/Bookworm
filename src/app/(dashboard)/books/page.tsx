import { BookList } from '@/components/book/BookList';
import BookForm from '@/components/book/BookForm';
import { getBookGenres, getBooks } from '@/lib/books';

export default async function Books() {
  const books = await getBooks();
  const bookGenres = await getBookGenres('pl');
  console.log('books', books);
  console.log('bookGenres', bookGenres);
  return (
    <div>
      <BookForm bookGenres={bookGenres} />
      <div className="mt-15">
        <BookList books={books} />
      </div>
    </div>
  );
}
