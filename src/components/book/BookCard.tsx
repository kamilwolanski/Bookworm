'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star, MoreVertical, LibraryBig, BookPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookCardDTO } from '@/lib/userbooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import userIcon from '@/app/assets/icons/user.svg';
import multipleUsersIcon from '@/app/assets/icons/multiple_users.svg';

import AddBookStepperDialog from '@/components/book/addBookStepper/AddBookStepperDialog';
import RateBookStepperDialog from '@/components/book/ratebook/RateBookStepperDialog';

export function BookCard({ bookItem }: { bookItem: BookCardDTO }) {
  const router = useRouter();

  const { book, representativeEdition } = bookItem;

  const [dialogType, setDialogType] = useState<
    null | 'delete' | 'rate' | 'showOtherEditions'
  >(null);
  const openDialog = dialogType !== null;

  // guard na nawigację karty (click-through fix)
  const startedOnCardRef = useRef(false);
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
        {bookItem.representativeEdition.coverUrl ? (
          <Image
            src={bookItem.representativeEdition.coverUrl}
            alt={`Okładka książki ${bookItem.representativeEdition.title}`}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
            Brak okładki
          </div>
        )}

        <div className="absolute top-0 left-0 p-2 w-full flex justify-between items-center gap-2">
          {bookItem.badges.onShelf ? (
            bookItem.badges.hasOtherEdition ? (
              <div className="bg-badge-other-edition text-primary-foreground px-3 py-1 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Na półce (inne wyd.)</span>{' '}
                  <LibraryBig size={16} />
                </div>
              </div>
            ) : (
              <div className="bg-badge-owned text-primary-foreground px-3 py-1 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Na półce</span>{' '}
                  <LibraryBig size={16} />
                </div>
              </div>
            )
          ) : (
            <AddBookStepperDialog
              bookId={book.id}
              editions={book.editions}
              dialogTitle={`${representativeEdition.title} - ${book.authors.map((a) => a.name).join(', ')}`}
              userEditions={bookItem.userState.byEdition}
              userReviews={bookItem.ratings.userReviews}
            />
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
                  <DropdownMenuItem
                    className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                    data-no-nav="true"
                    onClick={() => {
                      setDialogType('showOtherEditions');
                    }}
                  >
                    <BookPlus className={`w-4 h-4`} />
                    Pokaż inne wydania
                  </DropdownMenuItem>
                  {/* RATE */}
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                    data-no-nav="true"
                    onClick={() => {
                      setDialogType('rate');
                    }}
                  >
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    Oceń
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {dialogType === 'rate' && (
              <RateBookStepperDialog
                bookId={bookItem.book.id}
                dialogTitle="Oceń książkę"
                onlyContent={true}
                afterSuccess={() => setDialogType(null)}
                editions={book.editions}
                userReviews={bookItem.ratings.userReviews}
              />
            )}

            {dialogType === 'showOtherEditions' && (
              <AddBookStepperDialog
                bookId={book.id}
                editions={book.editions}
                dialogTitle={`${representativeEdition.title} - ${book.authors.map((a) => a.name).join(', ')}`}
                userEditions={bookItem.userState.byEdition}
                onlyContent={true}
                otherEditionsMode={true}
                userReviews={bookItem.ratings.userReviews}
                afterSuccess={() => setDialogType(null)}
              />
            )}
          </Dialog>
        </div>

        <div className="bg-gradient-to-t from-black/90 via-black/50 to-black/40 backdrop-blur-sm absolute bottom-0 left-0 px-3 pt-2 pb-3 w-full flex justify-between min-h-32 rounded-b-lg">
          <div className="flex justify-between w-full">
            <div className="w-full flex flex-col justify-between">
              <div className="pb-1">
                <h3 className="font-semibold text-lg">
                  {bookItem.representativeEdition.title}
                </h3>
                <p className="text-md">
                  {bookItem.book.authors.map((author) => author.name)}
                </p>
              </div>

              <div className="flex gap-2 pt-1 border-gray-300/30 border-t">
                <div className="flex gap-1">
                  <Image src={multipleUsersIcon} alt="icon" />
                  <span className="flex items-center gap-1 text-sm">
                    {bookItem.ratings.bookAverage ?? 0}/5{' '}
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                  </span>
                </div>
                {bookItem.ratings.representativeEditionRating && (
                  <div className="flex gap-1">
                    <Image src={userIcon} alt="icon" />
                    <span className="flex items-center gap-1 text-sm">
                      {bookItem.ratings.representativeEditionRating}/5{' '}
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
