import { HeroSection } from '@/components/homepage/HeroSection';
import { getTheNewestEditions } from '@/lib/books';
import { BookSection } from '@/components/homepage/BookSection';
import { BrowseBooksSection } from '@/components/homepage/BrowseBooksSection';
import { BookCardDTO } from '@/lib/userbooks';

export default async function MainPage() {
  // const session = await getUserSession();
  // const userId = session?.user?.id;
  // const response = await getTopBooksWithTopEdition(userId);
  // const topRatedResponse = await getBestRatedBooks(userId);
  const newestBooksResponse: BookCardDTO[] = await getTheNewestEditions();

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* <BookSection
        title="Popularne teraz"
        subtitle="Książki które czytają wszyscy"
        bookItems={response}
        variant="white"
        showViewAll={false}
      />
      <BookSection
        title="Najwyżej oceniane"
        subtitle="Perły literatury według naszych czytelników"
        bookItems={topRatedResponse}
        variant="grey"
        showViewAll={false}
      /> */}
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
