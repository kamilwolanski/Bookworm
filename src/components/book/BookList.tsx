'use client';

import useSWR from 'swr';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import NoResults from '@/components/states/NoResults';
import { fetcher } from '@/app/services/fetcher';
import { useSession } from 'next-auth/react';
import { Suspense, useMemo } from 'react';
import { BookCardDTO } from '@/lib/books';
import { EditionUserResponseItem } from '@/lib/user';
import { BookCard } from '@/components/book/BookCard';
import { usePathname } from 'next/navigation';

type BookListProps = {
  bookItems: BookCardDTO[];
  totalCount: number;
  pageSize: number;
  page: number;
  gridColsClassNames?: string;
};

export function BookList(props: BookListProps) {
  const { bookItems, page, pageSize, totalCount, gridColsClassNames } = props;
  const { status } = useSession();
  const pathname = usePathname();

  const editionIds = useMemo(
    () =>
      Array.from(
        new Set(bookItems.map((item) => item.representativeEdition.id))
      ),
    [bookItems]
  );
  const shouldFetch = status === 'authenticated' && editionIds.length > 0;
  const swrKey = shouldFetch ? ['/api/editions', editionIds] : null;
  const { data, isLoading } = useSWR<EditionUserResponseItem[]>(
    swrKey,
    ([url, editions]: [string, string[]]) =>
      fetcher<EditionUserResponseItem[]>(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editionIds: editions,
        }),
      })
  );

  return (
    <>
      {bookItems.length > 0 ? (
        <div className="flex-1">
          <div
            className={`grid ${gridColsClassNames ? gridColsClassNames : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 gap-2 3xl:gap-10'} `}
          >
            {bookItems.map((item) => {
              const userState = data?.find(
                (el) => el.id === item.representativeEdition.id
              )?.userState;
              const rating = data?.find(
                (el) => el.id === item.representativeEdition.id
              )?.rating;
              return (
                <BookCard
                  key={item.representativeEdition.id}
                  bookItem={item}
                  userState={userState}
                  rating={rating}
                  userStateIsLoading={isLoading}
                  pathname={pathname}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-5">
          <NoResults />
        </div>
      )}

      <Suspense>
        {totalCount > pageSize && (
          <PaginationWithLinks
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        )}
      </Suspense>
    </>
  );
}
