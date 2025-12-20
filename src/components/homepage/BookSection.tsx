'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/book/BookCard';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/app/services/fetcher';
import { BookCardDTO } from '@/lib/books';
import { EditionUserResponseItem } from '@/lib/user';

interface BookSectionProps {
  title: string;
  subtitle?: string;
  bookItems: BookCardDTO[];
  showViewAll?: boolean;
  variant: 'white' | 'grey';
}

export function BookSection({
  title,
  subtitle,
  bookItems,
  showViewAll = true,
  variant,
}: BookSectionProps) {
  const { status } = useSession();
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
    <section
      className={`py-9 md:py-18 px-6 ${variant === 'white' ? 'bg-card' : ''}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          {showViewAll && (
            <Button variant="outline">
              Zobacz wszystkie
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-5">
          {bookItems.map((item) => {
            const userState = data?.find(
              (el) => el.id === item.representativeEdition.id
            )?.userState;
            const rating = data?.find(
              (el) => el.id === item.representativeEdition.id
            )?.rating;
            return (
              <BookCard
                bookItem={item}
                key={item.representativeEdition.id}
                userState={userState}
                rating={rating}
                userStateIsLoading={isLoading}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
