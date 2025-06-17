// import { BookList } from '@/components/book/BookList';
// import BookForm from '@/components/book/BookForm';

import BackTopBar from '@/components/BackTopBar';
import { getBookAction } from '@/app/(dashboard)/actions';
import BookDetails from '@/components/book/BookDetails';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function Book({ params }: BookPageProps) {
  const { id } = await params;

  const book = await getBookAction(id);

  return (
    <>
      {book.isError === false && book.data ? (
        <div>
          <BackTopBar />
          <BookDetails {...book.data} />
        </div>
      ) : (
        <p>dupa</p>
      )}
    </>
  );
}
