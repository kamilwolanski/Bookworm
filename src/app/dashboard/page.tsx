import { BookList } from '@/components/book/BookList';
import BookForm from '@/components/book/BookForm';
import { getBooks } from '@/lib/books';

export default async function Home() {
  const books = await getBooks();
  // console.log('books', books);
  return (
    <div>
      <BookForm />
      <div className="mt-15">
        <BookList books={books} />
      </div>
    </div>
  );
}
