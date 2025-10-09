import { BookList } from '@/components/book/BookList';
import { redirect } from 'next/navigation';
import { getBookGenres, getBooksAll } from '@/lib/userbooks';
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

type Props = {
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

const ITEMS_PER_PAGE = 18;

export default async function ShelfBooks({ searchParams }: Props) {
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

  const { items, totalCount } = await getBooksAll(
    currentPage,
    ITEMS_PER_PAGE,
    genresParams,
    myShelf,
    userRatings,
    statuses,
    rating,
    search,
    userId
  );

  const bookGenres = await getBookGenres('pl');

  return (
    <div className="min-h-full flex flex-col ">
      <div className="mt-5 flex flex-1">
        <div className="hidden lg:block">
          <BookFilters bookGenres={bookGenres} genresParams={genresParams} />
        </div>
        <div className="md:ms-16 flex flex-col min-h-[80vh] w-full">
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
                        Pokaż wyniki ({totalCount})
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden lg:block">{session && <ShelfSwitch />}</div>
          </div>
          <BookList
            bookItems={items}
            page={currentPage}
            pageSize={ITEMS_PER_PAGE}
            totalCount={totalCount}
          />
        </div>
      </div>
    </div>
  );
}
