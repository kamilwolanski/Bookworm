import BookForm from '@/components/BookForm';
import { getBooks } from '@/lib/books';

export default async function Home() {
  const books = await getBooks();
  console.log('books', books);
  return (
    <div className="max-w-50">
      <BookForm />
    </div>
  );
}
