'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star, Trash2, MoreVertical, Check, Plus, BookA } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookWithUserData } from '@/lib/userbooks';
import { removeUserBookAction } from '@/app/(main)/books/actions/bookActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import RateBookBtn from './ratebook/RateBookBtn'; // <-- import
import userIcon from '@/app/assets/icons/user.svg';
import multipleUsersIcon from '@/app/assets/icons/multiple_users.svg';
import DeleteDialog from '@/components/forms/DeleteDialog';

export function BookCard({ book }: { book: BookWithUserData }) {
  const router = useRouter();

  const [dialogType, setDialogType] = React.useState<null | 'delete' | 'rate'>(
    null
  );
  const openDialog = dialogType !== null;

  // guard na nawigację karty (click-through fix)
  const startedOnCardRef = React.useRef(false);
  const isInteractiveTarget = (el: EventTarget | null) =>
    !!(el as HTMLElement | null)?.closest(
      '[data-no-nav="true"],a,button,[role="button"],input,textarea,select,label'
    );

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!startedOnCardRef.current || isInteractiveTarget(e.target)) return;
    router.push(`/books/${book.id}`);
  };

  return (
    <Card
      className="cursor-pointer border-none h-full shadow-md hover:shadow-xl p-1 rounded-xl"
      onClick={handleClick}
      key={book.id}
    >
      <div className="relative aspect-[3/4] w-full">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={`Okładka książki ${book.title}`}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
            Brak okładki
          </div>
        )}

        <div className="absolute top-0 left-0 p-2 w-full flex justify-between items-center">
          {book.isOnShelf ? (
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-sm">Na półce</span> <Check size={16} />
              </div>
            </div>
          ) : (
            <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-sm">Dodaj</span> <Plus size={16} />
              </div>
            </div>
          )}

          <Dialog
            open={openDialog}
            onOpenChange={(o) => !o && setDialogType(null)}
          >
            <div data-no-nav="true">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild className="w-8">
                  <button
                    type="button"
                    className="bg-card-menu-trigger hover:bg-card-menu-trigger-hover rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                    aria-label="Więcej akcji"
                    data-no-nav="true"
                  >
                    <MoreVertical
                      className="text-popover-foreground"
                      size={18}
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" data-no-nav="true">
                  {book.userBook && (
                    <>
                      <DropdownMenuItem
                        className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                        data-no-nav="true"
                        onSelect={() => {
                          setDialogType('rate');
                        }}
                      >
                        <BookA size={18} />
                        Zmień status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}

                  {/* RATE */}

                  <DropdownMenuItem
                    className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                    data-no-nav="true"
                    onClick={() => {
                      setDialogType('rate');
                    }}
                  >
                    <Star
                      className={`w-4 h-4 ${book.myRating ? 'fill-current text-yellow-400' : ''}`}
                    />
                    {book.myRating ? 'Zmień ocenę' : 'Oceń'}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* DELETE */}
                  {book.userBook ? (
                    <DropdownMenuItem
                      className="px-2 py-1.5 text-sm flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                      data-no-nav="true"
                      onClick={() => {
                        setDialogType('delete');
                      }}
                    >
                      <Trash2 size={16} />
                      Usuń rekord
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="px-2 py-1.5 text-sm flex items-center gap-2 text-secondary focus:text-secondary cursor-pointer"
                      data-no-nav="true"
                    >
                      <Plus size={16} />
                      Dodaj na półkę
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Treści dialogów */}
            {dialogType === 'delete' && book.userBook && (
              <DeleteDialog
                id={book.id}
                removeAction={removeUserBookAction}
                revalidatePath="/books"
                dialogTitle={
                  <>
                    Czy na pewno chcesz usunąć <b>„{book.title}”</b> ze swojej
                    półki?
                  </>
                }
                onSuccess={() => setDialogType(null)}
              />
            )}

            {dialogType === 'rate' && (
              <RateBookBtn
                bookId={book.id}
                rating={book.myRating ?? 0} // domyślnie 0, jeśli brak oceny
                revalidatePath="/books"
                dialogTitle={book.myRating ? 'Zmień ocenę' : 'Oceń książkę'}
                onSuccess={() => setDialogType(null)}
              />
            )}
          </Dialog>
        </div>

        <div className="bg-gradient-to-t from-black/90 via-black/50 to-black/40 backdrop-blur-sm absolute bottom-0 left-0 px-3 pt-2 pb-3 w-full flex justify-between min-h-32 rounded-b-lg">
          <div className="flex justify-between w-full">
            <div className="w-full flex flex-col justify-between">
              <div className="pb-1">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-md">{book.author}</p>
              </div>

              <div className="flex gap-2 pt-1 border-gray-300/30 border-t">
                <div className="flex gap-1">
                  <Image src={multipleUsersIcon} alt="icon" />
                  <span className="flex items-center gap-1 text-sm">
                    {book.averageRating}/5{' '}
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                  </span>
                </div>
                {book.myRating && (
                  <div className="flex gap-1">
                    <Image src={userIcon} alt="icon" />
                    <span className="flex items-center gap-1 text-sm">
                      {book.myRating}/5{' '}
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
