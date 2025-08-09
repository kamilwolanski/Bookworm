'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import DeleteBtn from '../forms/DeleteBookBtn';
import { Star, Trash2, MoreVertical, Check, Plus, BookA } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookWithUserData } from '@/lib/userbooks';
import { removeUserBookAction } from '@/app/(main)/books/actions/bookActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import userIcon from '@/app/assets/icons/user.svg';
import multipleUsersIcon from '@/app/assets/icons/multiple_users.svg';

export function BookCard({ book }: { book: BookWithUserData }) {
  const router = useRouter();
  return (
    <Card
      className="cursor-pointer h-full border-none shadow-md py-0 bg-black rounded-lg"
      onClick={() => router.push(`/books/${book.id}`)}
    >
      <div className="relative aspect-[3/4] w-full">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={`Okładka książki ${book.title}`}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
            Brak okładki
          </div>
        )}
        <div className="absolute top-0 left-0 p-2 w-full flex justify-between items-center">
          {book.isOnShelf ? (
            <div className="bg-[#378212] px-3 py-1 text-white rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-sm">Na półce</span> <Check size={16} />
              </div>
            </div>
          ) : (
            <div className="bg-[#006DC0] px-3 py-1 text-white rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-sm">Dodaj</span> <Plus size={16} />
              </div>
            </div>
          )}

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="w-8">
              <button
                className="bg-black hover:bg-gray-900 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <MoreVertical color="white" size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-[#111111] border-0 text-[#CCCCCC] "
            >
              {book.userBook && (
                <>
                  <span className="cursor-pointer px-2 py-1.5 text-sm flex items-center gap-2">
                    <BookA size={18} />
                    Zmień status
                  </span>
                  <DropdownMenuSeparator />
                </>
              )}

              {book.myRating ? (
                <span className="cursor-pointer px-2 py-1.5 text-sm flex items-center gap-2">
                  <Star size={16} className="fill-current text-yellow-400" />
                  Zmień ocenę
                </span>
              ) : (
                <span className="cursor-pointer px-2 py-1.5 text-sm flex items-center gap-2">
                  <Star size={16} />
                  Oceń
                </span>
              )}
              <DropdownMenuSeparator />

              {book.userBook ? (
                <DeleteBtn
                  bookId={book.id}
                  removeBookAction={removeUserBookAction}
                  revalidatePath="/books"
                  dialogTitle={
                    <>
                      Czy na pewno chcesz usunąć <b>„{book.title}”</b> ze swojej
                      półki?
                    </>
                  }
                >
                  <div className="cursor-pointer px-2 py-1.5 text-sm  flex items-center gap-2 text-[#FF6D8F]">
                    <Trash2 size={16} />
                    Usuń z półki
                  </div>
                </DeleteBtn>
              ) : (
                <span className="cursor-pointer px-2 py-1.5 text-sm flex items-center gap-2 text-blue-400">
                  <Plus size={16} />
                  Dodaj na półkę
                </span>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div
          className="bg-gradient-to-t from-black/90 via-black/50 to-black/40 
          backdrop-blur-sm absolute bottom-0 left-0 px-3 pt-2 pb-3 w-full flex justify-between text-white min-h-32 rounded-b-lg"
        >
          <div className="flex justify-between w-full">
            <div className="w-full flex flex-col justify-between">
              <div className="pb-1">
                <h3 className="font-semibold text-md">{book.title}</h3>
                <p className="text-md text-gray-300">{book.author}</p>
              </div>
              <div className="flex gap-2 pt-1 border-gray-300/30 border-t">
                <div className="flex gap-1">
                  <Image src={multipleUsersIcon} alt="icon" />
                  <span className="flex items-center gap-1">
                    {book.averageRating}/5{' '}
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                  </span>
                </div>
                {book.myRating && (
                  <div className="flex gap-1">
                    <Image src={userIcon} alt="icon" />
                    <span className="flex items-center gap-1">
                      {book.myRating}/5
                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
