'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { removeBook } from '@/app/(dashboard)/actions';
import { startTransition, useActionState, useEffect } from 'react';
import { ActionResult } from '@/types/actions';
import { useRouter } from 'next/navigation';

type Book = {
  id: string;
  title: string;
  author: string;
  imageUrl: string | null;
};

export function BookCard({ book }: { book: Book }) {
  const [state, doAction, isPending] = useActionState<ActionResult, string>(
    removeBook,
    { isError: false }
  );
  const router = useRouter();

  useEffect(() => {
    if (state.status === 'success' && !state.isError) {
      router.refresh();
    }
  }, [state, router]);

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
      <CardContent className="p-4">
        <button
          className="bg-red-600 text-white p-2"
          onClick={() => {
            startTransition(() => {
              doAction(book.id);
            });
          }}
        >
          {isPending ? 'Usuwanie...' : 'Usuń'}
        </button>
        <h3 className="font-semibold text-lg">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <Button variant="outline" className="mt-4 w-full">
          Szczegóły
        </Button>
      </CardContent>
    </Card>
  );
}
