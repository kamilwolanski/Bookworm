import AddEditionDialog from '@/components/admin/edition/AddEditionDialog';
import { SearchBar } from '@/components/shared/SearchBar';
import { getBookBySlug } from '@/lib/adminBooks';

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookEdition({ params }: BookPageProps) {
  const { slug } = await params;

  const book = await getBookBySlug(slug);
  console.log('book', book);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddEditionDialog
          bookId={book.id}
          bookSlug={slug}
          bookTitle={book.title}
        />
        <div className="ms-10 w-full">
          <SearchBar placeholder="wyszukaj wydanie" />
        </div>
      </div>
      <div className="flex flex-1"></div>
    </div>
  );
}
