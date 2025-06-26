import { BookList } from '@/components/book/BookList';
import BookForm from '@/components/book/BookForm';
import { getBookGenres } from '@/lib/books';
import { getBooksAction } from './actions';

export default async function Books() {
  const books = await getBooksAction();
  const bookGenres = await getBookGenres('pl');
  // console.log('books', books);
  // console.log('bookGenres', bookGenres);
  if (!books.isError && books.data)
    return (
      <div>
        <BookForm bookGenres={bookGenres} />
        <div className="mt-15">
          <BookList books={books.data} />
        </div>
      </div>
    );
}
