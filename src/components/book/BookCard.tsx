'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Star, MoreVertical, BookPlus, Plus } from 'lucide-react';
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
import LoginDialog from '@/components/auth/LoginDialog';
import Link from 'next/link';

export function BookCard({ bookItem }: { bookItem: BookCardDTO }) {
  const { status } = useSession();
  const { book, representativeEdition } = bookItem;

  const [dialogType, setDialogType] = useState<
    null | 'delete' | 'rate' | 'showOtherEditions' | 'login'
  >(null);
  const openDialog = dialogType !== null;

  return (
    <Card
      key={book.id}
      className="relative cursor-pointer border-none h-full shadow-md hover:shadow-xl p-1 rounded-xl"
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

        <div className="absolute top-0 left-0 z-20 p-2 w-full flex justify-between items-center gap-2">
          {bookItem.badges.onShelf ? (
            bookItem.badges.hasOtherEdition ? (
              <div className="bg-badge-other-edition text-primary-foreground px-3 py-1 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium">
                    Na półce (inne wyd.)
                  </span>
                </div>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-2xl bg-badge-owned text-primary border border-badge-owned-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium">
                    Na półce
                  </span>
                </div>
              </div>
            )
          ) : status === 'authenticated' ? (
            <AddBookStepperDialog
              bookId={book.id}
              bookSlug={book.slug}
              editions={book.editions}
              dialogTitle={`${representativeEdition.title} - ${book.authors.map((a) => a.name).join(', ')}`}
              userEditions={bookItem.userState?.byEdition}
              userReviews={bookItem.ratings.userReviews}
            />
          ) : (
            <LoginDialog
              dialogTriggerBtn={
                <button
                  type="button"
                  className="bg-badge-new text-secondary-foreground hover:bg-badge-new-hover px-3 py-1 rounded-2xl cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium">
                      Dodaj
                    </span>
                    <Plus size={14} />
                  </div>
                </button>
              }
            />
          )}

          <Dialog
            open={openDialog}
            onOpenChange={(o) => !o && setDialogType(null)}
          >
            <div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild className="w-8">
                  <button
                    type="button"
                    className="bg-card-menu-trigger hover:bg-card-menu-trigger-hover rounded-full !w-7 !h-7 flex items-center justify-center cursor-pointer"
                    aria-label="Więcej akcji"
                  >
                    <MoreVertical
                      className="text-popover-foreground"
                      size={17}
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                    onClick={() => setDialogType('showOtherEditions')}
                  >
                    <BookPlus className="w-4 h-4" />
                    Wszystkie wydania
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {status === 'authenticated' ? (
                    <DropdownMenuItem
                      className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                      onClick={() => setDialogType('rate')}
                    >
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      Oceń
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                      onClick={() => setDialogType('login')}
                    >
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      Oceń
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {dialogType === 'rate' && (
              <RateBookStepperDialog
                bookId={bookItem.book.id}
                bookSlug={book.slug}
                dialogTitle="Oceń książkę"
                onlyContent
                afterSuccess={() => setDialogType(null)}
                editions={book.editions}
                userReviews={bookItem.ratings.userReviews}
              />
            )}

            {dialogType === 'showOtherEditions' && (
              <AddBookStepperDialog
                bookId={book.id}
                bookSlug={book.slug}
                editions={book.editions}
                dialogTitle={`${representativeEdition.title} - ${book.authors.map((a) => a.name).join(', ')}`}
                userEditions={bookItem.userState?.byEdition}
                onlyContent
                otherEditionsMode
                userReviews={bookItem.ratings.userReviews}
                afterSuccess={() => setDialogType(null)}
              />
            )}

            {dialogType === 'login' && <LoginDialog onlyContent />}
          </Dialog>
        </div>

        <div className="bg-gradient-to-t from-black/90 via-black/50 to-black/40 backdrop-blur-sm absolute bottom-0 left-0 px-3 pt-2 pb-3 w-full flex justify-between lg:min-h-32 rounded-b-lg z-10">
          <div className="flex justify-between w-full">
            <div className="w-full flex flex-col justify-between">
              <div className="pb-1">
                <h3 className="font-semibold text-md md:text-lg">
                  {bookItem.representativeEdition.title}
                </h3>
                <p className="text-xs lg:text-base">
                  {bookItem.book.authors.map((a) => a.name).join(', ')}
                </p>
              </div>

              <div className="flex gap-2 pt-1 border-gray-300/30 border-t">
                <div className="flex gap-1 items-center">
                  <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                    <Image
                      src={multipleUsersIcon}
                      alt="icon"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="flex items-center gap-1 text-xs sm:text-sm">
                    {bookItem.ratings.bookAverage ?? 0}/5{' '}
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                  </span>
                </div>
                {bookItem.ratings.representativeEditionRating && (
                  <div className="flex gap-1 items-center">
                    <div className="relative w-4 h-4 sm:w-5 sm:h-5">
                      <Image
                        src={userIcon}
                        alt="icon"
                        fill
                        className="object-contain"
                      />
                    </div>
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

      <Link
        href={`/books/${book.slug}/${representativeEdition.id}`}
        className="absolute inset-0 z-10"
        aria-label={`Przejdź do ${representativeEdition.title}`}
      >
        <span className="sr-only">{representativeEdition.title}</span>
      </Link>
    </Card>
  );
}
