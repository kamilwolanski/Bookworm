'use client';

import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/book/BookCard';
import { BookCardDTO } from '@/lib/userbooks';
import { useSession } from 'next-auth/react';
import {
  EditionUserResponseItem,
  EditionUserState,
  getTheUserInformationForEditions,
} from '@/lib/books';
import { useEffect, useMemo, useState } from 'react';

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
  const { status, data } = useSession();
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [editionsUserData, setEditionsUserData] = useState<Map<
    string,
    EditionUserState
  > | null>(null);
  const editionIds = useMemo(
    () => bookItems.map((item) => item.representativeEdition.id),
    [bookItems]
  );

  useEffect(() => {
    const safeEditionIds = editionIds.filter(Boolean);
    if (safeEditionIds.length === 0) return;
    async function loadUserData() {
      try {
        setLoadingUserData(true);
        const response = await fetch('/api/editions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data?.user.id,
            editionIds: safeEditionIds,
          }),
        });

        const json: {
          data: EditionUserResponseItem[];
        } = await response.json();

        const map = new Map(json.data.map((item) => [item.id, item.userState]));

        setEditionsUserData(map);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingUserData(false);
      }
    }

    if (status === 'authenticated') {
      loadUserData();
    }
  }, [data, editionIds, status]);

  console.log('bookItems', bookItems);
  console.log(
    'map',
    editionsUserData?.get('1c4801cc-251f-4f8d-be07-1bb312afa071')
  );

  return (
    <section
      className={`py-9 md:py-18 px-6 ${variant === 'white' ? 'bg-card' : ''}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
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

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-5">
          {bookItems.map((item) => {
            const userState = editionsUserData?.get(
              item.representativeEdition.id
            );
            return (
              <BookCard
                bookItem={item}
                key={item.book.id}
                userState={userState}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
