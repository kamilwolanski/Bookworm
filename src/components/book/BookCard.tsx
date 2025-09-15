'use client';

import {
  useRef,
  useActionState,
  useState,
  useOptimistic,
  startTransition,
} from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import {
  Star,
  Trash2,
  MoreVertical,
  Plus,
  BookA,
  LibraryBig,
  BookCopy,
  BookPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BookCardDTO, RemoveBookFromShelfPayload } from '@/lib/userbooks';
import {
  addBookToShelfAction,
  removeBookFromShelfAction,
} from '@/app/(main)/books/actions/bookActions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Dialog } from '@/components/ui/dialog';
import RatingDialogContent from '@/components/book/ratebook/RatingDialogContent';
import userIcon from '@/app/assets/icons/user.svg';
import multipleUsersIcon from '@/app/assets/icons/multiple_users.svg';
// import DeleteDialog from '@/components/forms/DeleteDialog';
import { ActionResult } from '@/types/actions';
import { AddBookToShelfPayload } from '@/lib/userbooks';
import { UserBook } from '@prisma/client';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import OtherBookDialog from '@/components/book/otherBooks/OtherBooksDialog';
import AddBookStepperDialog from './addBookStepper/AddBookStepperDialog';

export function BookCard({ bookItem }: { bookItem: BookCardDTO }) {
  const router = useRouter();
  const [state, addBook, isPending] = useActionState<
    ActionResult<UserBook>,
    AddBookToShelfPayload
  >(addBookToShelfAction, { isError: false });

  const [stateRemoveBook, removeBook, removeBookIsPending] = useActionState<
    ActionResult<void>,
    RemoveBookFromShelfPayload
  >(removeBookFromShelfAction, { isError: false });

  const { book, representativeEdition } = bookItem;
  const [optimisticBook, setOptimisticBook] = useOptimistic(
    bookItem,
    (
      current,
      action: {
        type: 'ADD' | 'REMOVE' | 'ROLLBACK';
        payload?: Partial<BookCardDTO>;
      }
    ) => {
      switch (action.type) {
        case 'ADD':
          const userState = action.payload?.userState;
          return {
            ...current,
            userState: userState ? userState : current.userState,
            badges: {
              ...current.badges,
              onShelf:
                userState?.ownedEditionIds.includes(representativeEdition.id) ??
                false,
              hasOtherEdition: !userState?.ownedEditionIds.includes(
                representativeEdition.id
              ),
            },
          };
        case 'REMOVE':
          return { ...current, isOnShelf: false };
        case 'ROLLBACK':
          return { ...current, ...action.payload };
        default:
          return current;
      }
    }
  );

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

  const handleAdd = (editionId: string) => {
    startTransition(() => {
      const snapshot = optimisticBook;
      setOptimisticBook({
        type: 'ADD',
        payload: {
          userState: {
            ownedEditionIds: [...snapshot.userState.ownedEditionIds, editionId],
            hasAnyEdition: true,
            ownedEditionCount: snapshot.userState.ownedEditionCount + 1,
            primaryStatus: 'WANT_TO_READ',
            byEdition: [
              ...snapshot.userState.byEdition,
              {
                editionId,
                readingStatus: 'WANT_TO_READ',
              },
            ],
          },
        },
      });
      addBook({
        bookId: book.id,
        editionId: editionId,
      });

      if (state.isError) {
        setOptimisticBook({ type: 'ROLLBACK', payload: snapshot });
        console.error('Nie udało się dodać na półkę');
      }
    });
  };

  const handleRemove = () => {
    const snapshot = optimisticBook;
    setOptimisticBook({ type: 'REMOVE' });
    startTransition(() => {
      removeBook({
        bookId: book.id,
        editionId: representativeEdition.id,
      });
      setDialogType(null);
      if (stateRemoveBook.isError) {
        setOptimisticBook({ type: 'ROLLBACK', payload: snapshot });
        console.error('Nie udało się usunąć na półkę');
      }
    });
  };

  return (
    <Card
      className="cursor-pointer border-none h-full shadow-md hover:shadow-xl p-1 rounded-xl"
      onClick={handleClick}
      key={book.id}
    >
      <div className="relative aspect-[3/4] w-full">
        {optimisticBook.representativeEdition.coverUrl ? (
          <Image
            src={optimisticBook.representativeEdition.coverUrl}
            alt={`Okładka książki ${optimisticBook.representativeEdition.title}`}
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
          {optimisticBook.badges.onShelf ? (
            optimisticBook.badges.hasOtherEdition ? (
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
            // <OtherBookDialog
            //   editions={book.editions}
            //   dialogTitle="Wybierz wydanie"
            //   handleAdd={handleAdd}
            //   userEditions={optimisticBook.userState.byEdition}
            // />

            <AddBookStepperDialog
              bookId={book.id}
              editions={book.editions}
              dialogTitle={`${representativeEdition.title} - ${book.authors.map((a) => a.name).join(', ')}`}
              handleAdd={handleAdd}
              userEditions={optimisticBook.userState.byEdition}
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

                  {/* <DropdownMenuItem
                    className="px-2 py-1.5 text-sm flex items-center gap-2 cursor-pointer"
                    data-no-nav="true"
                    onClick={() => {
                      setDialogType('rate');
                    }}
                  >
                    <Star
                      className={`w-4 h-4 ${optimisticBook.ratings.user.rating ? 'fill-current text-yellow-400' : ''}`}
                    />
                    {optimisticBook.ratings.user.rating
                      ? 'Zmień ocenę'
                      : 'Oceń'}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator /> */}

                  {/* DELETE */}
                  {optimisticBook.userState.byEdition.length > 0 ? (
                    <DropdownMenuItem
                      className="px-2 py-1.5 text-sm flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                      data-no-nav="true"
                      onClick={() => {
                        setDialogType('delete');
                      }}
                    >
                      <Trash2 size={16} />
                      Usuń wydanie z półki
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="px-2 py-1.5 text-sm flex items-center gap-2 text-secondary focus:text-secondary cursor-pointer"
                      data-no-nav="true"
                      onClick={() =>
                        addBook({
                          bookId: optimisticBook.book.id,
                          editionId: optimisticBook.representativeEdition.id,
                        })
                      }
                    >
                      <Plus size={16} />
                      Dodaj na półkę
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Treści dialogów */}
            {dialogType === 'delete' &&
              optimisticBook.userState.byEdition.length > 0 && (
                <DialogContent
                  onSelect={(e) => e.preventDefault()}
                  className="
        sm:max-w-md p-6 rounded-2xl
    border border-border
    shadow-2xl
    bg-background/95 backdrop-blur
    supports-[backdrop-filter]:bg-background/80 
    "
                >
                  <DialogHeader>
                    <DialogTitle>Usun</DialogTitle>
                    <DialogDescription>
                      Usunięcie jest trwałe i nie będzie można go cofnąć.
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                      >
                        Anuluj
                      </Button>
                    </DialogClose>

                    <Button
                      type="button"
                      disabled={removeBookIsPending}
                      className="cursor-pointer"
                      onClick={handleRemove}
                    >
                      {isPending ? 'Usuwanie...' : 'Usuń'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}

            {dialogType === 'rate' && (
              <RatingDialogContent
                bookId={optimisticBook.book.id}
                editionId={optimisticBook.representativeEdition.id}
                initialRating={optimisticBook.ratings.user.rating ?? undefined}
                dialogTitle={
                  optimisticBook.ratings.user.rating
                    ? 'Zmień ocenę'
                    : 'Oceń książkę'
                }
                onSuccess={() => setDialogType(null)}
              />
            )}

            {dialogType === 'showOtherEditions' && (
              <AddBookStepperDialog
                bookId={book.id}
                editions={book.editions}
                dialogTitle={`${representativeEdition.title} - ${book.authors.map((a) => a.name).join(', ')}`}
                handleAdd={handleAdd}
                userEditions={optimisticBook.userState.byEdition}
                onlyContent={true}
                otherEditionsMode={true}
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
                  {optimisticBook.representativeEdition.title}
                </h3>
                <p className="text-md">
                  {optimisticBook.book.authors.map((author) => author.name)}
                </p>
              </div>

              <div className="flex gap-2 pt-1 border-gray-300/30 border-t">
                <div className="flex gap-1">
                  <Image src={multipleUsersIcon} alt="icon" />
                  <span className="flex items-center gap-1 text-sm">
                    {optimisticBook.ratings.bookAverage ?? 0}/5{' '}
                    <Star className="w-3 h-3 fill-current text-yellow-400" />
                  </span>
                </div>
                {optimisticBook.ratings.user.rating && (
                  <div className="flex gap-1">
                    <Image src={userIcon} alt="icon" />
                    <span className="flex items-center gap-1 text-sm">
                      {optimisticBook.ratings.user.rating}/5{' '}
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
