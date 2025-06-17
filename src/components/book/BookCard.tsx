'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteBtn from './DeleteBtn';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

type Book = {
  id: string;
  title: string;
  author: string;
  imageUrl: string | null;
};

export function BookCard({ book }: { book: Book }) {
  return (
    <Card className="w-[280px] rounded-2xl shadow-md overflow-hidden pt-0">
      <div className="relative aspect-[3/4] w-full">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
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
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-lg">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
          <DeleteBtn bookTitle={book.title} bookId={book.id}>
            <Button variant="outline" className="text-black cursor-pointer">
              <Trash2 color="red" />
            </Button>
          </DeleteBtn>
        </div>
        <Button variant="outline" className="mt-4 w-full cursor-pointer">
          <Link href={`/books/${book.id}`}>Szczegóły</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
