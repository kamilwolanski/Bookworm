import BookForm from '@/components/BookForm';
import { getBooks } from '@/lib/books';

export default async function Home() {
  const books = await getBooks();
  console.log('books', books);
  return (
    <>
      <h1>Dodaj książke</h1>
      <div className="max-w-50">
        <BookForm />
      </div>
    </>
  );
}
