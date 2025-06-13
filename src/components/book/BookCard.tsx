import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
};

export function BookCard({ book }: { book: Book }) {
  return (
    <Card className="w-full rounded-2xl shadow-md overflow-hidden pt-0">
      <div className="relative h-48 w-full">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={`Okładka książki ${book.title}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
            Brak okładki
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <Button variant="outline" className="mt-4 w-full">
          Szczegóły
        </Button>
      </CardContent>
    </Card>
  );
}
