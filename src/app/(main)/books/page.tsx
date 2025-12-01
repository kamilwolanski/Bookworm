import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/session';
import BookFilters from '@/components/book/BookFilters';
import { ReadingStatus } from '@prisma/client';
import { SearchBar } from '@/components/shared/SearchBar';
import ShelfSwitch from '@/components/book/ShelfSwitch';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ActiveFilters from '@/components/shared/ActiveFilters';
import { Suspense } from 'react';
import BooksTableServer from './BooksTableServer';
import CountResults from './CountResults';
import type { Metadata } from 'next';
import { getBookGenres } from '@/lib/books';

type BooksProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    genre?: string;
    userrating?: string;
    rating?: string;
    status?: string;
    myshelf?: string;
  }>;
};

export const metadata: Metadata = {
  title: 'BookWorm | Książki',
  description:
    'Wyszukiwarka książek online – sprawdź opisy, oceny i recenzje. BookWorm to baza tysięcy tytułów, które możesz przeglądać, filtrować i dodać do swojej kolekcji.',
};

const ITEMS_PER_PAGE = 18;

export default async function Books({ searchParams }: BooksProps) {
  const { page, search, genre, userrating, status, myshelf, rating } =
    searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const genresParams = genre?.toLocaleUpperCase().split(',') ?? [];
  const userRatings = userrating?.split(',') ?? [];
  const statuses = (status?.toUpperCase().split(',') as ReadingStatus[]) ?? {};
  const myShelf = Boolean(myshelf);

  const session = await getUserSession();
  const userId = session?.user?.id;

  if (myShelf && !userId) {
    redirect('/login'); // albo wyświetl 401
  }

  const bookGenres = await getBookGenres('pl');

  return (
    <div className="min-h-full flex flex-col ">
      <div className="mt-5 flex flex-1">
        <div className="hidden lg:block">
          <BookFilters bookGenres={bookGenres} genresParams={genresParams} />
        </div>
        <div className="md:ms-16 flex flex-col min-h-[85vh] w-full">
          <div className="flex items-center mb-6 sm:mb-10 gap-3">
            <div className="w-full lg:max-w-lg">
              <Sheet>
                <SearchBar placeholder="Wyszukaj książkę" />
                <div className="lg:hidden">
                  <ActiveFilters />
                </div>
                <SheetContent
                  side="right"
                  className="max-h-screen w-full overflow-y-scroll"
                >
                  <SheetHeader className="pb-0">
                    <SheetTitle className="text-center">
                      Dopasuj wyniki
                    </SheetTitle>
                  </SheetHeader>
                  <Separator />
                  <div className="px-4 mt-5">
                    <div className="mb-8">
                      <SearchBar
                        placeholder="Wyszukaj książkę"
                        showSheetTrigger={false}
                      />
                    </div>

                    <BookFilters
                      bookGenres={bookGenres}
                      genresParams={genresParams}
                    />
                  </div>

                  <SheetFooter className="bg-card sticky bottom-0">
                    <SheetClose asChild>
                      <Button className="cursor-pointer">
                        Pokaż wyniki (
                        <Suspense
                          key={JSON.stringify({
                            search,
                            genre,
                            userrating,
                            status,
                            myshelf,
                            rating,
                            userId,
                          })}
                          fallback="…"
                        >
                          <CountResults
                            params={{
                              genresParams,
                              myShelf,
                              statuses,
                              search,
                              userRatings,
                              rating,
                              userId,
                            }}
                          />
                        </Suspense>
                        )
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden lg:block">{session && <ShelfSwitch />}</div>
          </div>
          {session && (
            <div className="lg:hidden bg-card shadow-lg flex justify-between items-center rounded-lg py-2 px-3 mb-6">
              <span className="text-sm">
                <b>Tylko książki z mojej półki</b>
              </span>
              <ShelfSwitch showLabel={false} />
            </div>
          )}
          <Suspense
            key={JSON.stringify({
              currentPage,
              search,
              genre,
              userrating,
              status,
              myshelf,
              rating,
              userId,
            })}
            fallback={
              <div className="flex items-center justify-center min-h-[calc(100vh-300px)] lg:min-h-[calc(100vh-380px)] w-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-foreground" />
              </div>
            }
          >
            <BooksTableServer
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              userId={userId}
              params={{
                genresParams,
                myShelf,
                statuses,
                search,
                userRatings,
                rating,
              }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
