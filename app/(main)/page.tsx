import { BookSection } from "@/components/homepage/BookSection";
import { BrowseBooksSection } from "@/components/homepage/BrowseBooksSection";
import { HeroSection } from "@/components/homepage/HeroSection";
import {
  getBestRatedBooksCached,
  getTheNewestEditionsCached,
  getTopBooksWithTopEditionCached,
} from "@/lib/books";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <BookSection
        title="Popularne teraz"
        subtitle="Książki które czytają wszyscy"
        variant="white"
        showViewAll={false}
        fetchBooks={getTopBooksWithTopEditionCached}
      />
      <BookSection
        title="Najwyżej oceniane"
        subtitle="Perły literatury według naszych czytelników"
        variant="grey"
        showViewAll={false}
        fetchBooks={getBestRatedBooksCached}
      />
      <BookSection
        title="Nowości"
        subtitle="Świeżo dodane do naszego zbioru"
        variant="white"
        showViewAll={false}
        fetchBooks={getTheNewestEditionsCached}
      />
      <BrowseBooksSection />
    </div>
  );
}
