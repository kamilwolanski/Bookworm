'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DeleteBtn from '../forms/DeleteBookBtn';
import { Star, Trash2 } from 'lucide-react';
import { Book } from '@prisma/client';
import { BookStatus } from './BookStatus';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';

export function BookCard({ book }: { book: Book }) {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer h-full flex flex-col rounded-2xl border-[#30313E] shadow-md overflow-hidden py-0 bg-[#1A1D24]"
      onClick={() => router.push(`/books/${book.id}`)}
    >
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
        {book.rating !== null && (
          <div className="flex gap-1 absolute right-2 top-2 p-4 bg-black/60 backdrop-blur-sm rounded">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                className={
                  num <= book.rating! ? 'text-yellow-400 ' : 'text-gray-300 '
                }
              >
                <Star className="w-4 h-4 fill-current" />
              </button>
            ))}
          </div>
        )}
        <div className="absolute bottom-2 left-2 p-2">
          <Tooltip>
            <TooltipTrigger>
              <BookStatus status={book.readingStatus} onlyIcon iconSize={6} />
            </TooltipTrigger>
            <TooltipContent>
              <BookStatus status={book.readingStatus} onlyText textSize="xs" />
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-md text-white">{book.title}</h3>
            <p className="text-sm text-gray-300">{book.author}</p>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <DeleteBtn bookTitle={book.title} bookId={book.id}>
              <Button
                variant="outline"
                className="text-black cursor-pointer bg-[#30313E] border-0"
              >
                <Trash2 color="red" />
              </Button>
            </DeleteBtn>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
