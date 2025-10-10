import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/book/BookCard';
import { BookCardDTO } from '@/lib/userbooks';

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
          {bookItems.map((item) => (
            <BookCard bookItem={item} key={item.book.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
