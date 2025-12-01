import { HeroSection } from '@/components/homepage/HeroSection';
import {
  BookCardDTO,
  getBestRatedBooks,
  getTheNewestEditions,
  getTopBooksWithTopEdition,
} from '@/lib/books';
import { BookSection } from '@/components/homepage/BookSection';
import { BrowseBooksSection } from '@/components/homepage/BrowseBooksSection';

export default async function MainPage() {
  const mostPopularresponse = await getTopBooksWithTopEdition();
  const topRatedResponse = await getBestRatedBooks();
  const newestBooksResponse: BookCardDTO[] = await getTheNewestEditions();

  return (
    <div className="min-h-screen">
      <HeroSection />
      <BookSection
        title="Popularne teraz"
        subtitle="Książki które czytają wszyscy"
        bookItems={mostPopularresponse}
        variant="white"
        showViewAll={false}
      />
      <BookSection
        title="Najwyżej oceniane"
        subtitle="Perły literatury według naszych czytelników"
        bookItems={topRatedResponse}
        variant="grey"
        showViewAll={false}
      />
      <BookSection
        title="Nowości"
        subtitle="Świeżo dodane do naszego zbioru"
        bookItems={newestBooksResponse}
        variant="white"
        showViewAll={false}
      />

      <BrowseBooksSection />
    </div>
  );
}
