import { Button } from '@/components/ui/button';
import { Search, Filter, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function BrowseBooksSection() {
  return (
    <section className="bg-surface-primary dark:bg-surface-primary-dark py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-12 text-surface-primary-foreground">
          <h2 className="text-3xl font-bold mb-6">
            Potrzebujesz dokładniejszego wyszukiwania?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-surface-primary-muted-foreground">
            Skorzystaj z zaawansowanych filtrów, przeglądaj książki według
            gatunków, ocen i wielu innych kryteriów. Znajdź dokładnie to, czego
            szukasz w naszej bibliotece tysięcy tytułów.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent-2 text-accent-foreground-2 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 " />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-surface-primary-foreground">
              Zaawansowane filtry
            </h3>
            <p className="text-surface-primary-muted-foreground">
              Filtruj według gatunku, roku wydania, oceny, liczby stron i więcej
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent-2 text-accent-foreground-2 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 " />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-surface-primary-foreground">
              Szczegółowe wyszukiwanie
            </h3>
            <p className="text-surface-primary-muted-foreground">
              Wyszukuj po tytule, autorze, wydawnictwie, ISBN i słowach
              kluczowych
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-accent-2 text-accent-foreground-2 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-surface-primary-foreground">
              Organizuj swoją bibliotekę
            </h3>
            <p className="text-surface-primary-muted-foreground">
              Dodawaj książki do różnych półek, oznaczaj jako przeczytane lub do
              przeczytania
            </p>
          </div>
        </div>

        <Link href="/books">
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg font-semibold"
          >
            Przeglądaj wszystkie książki
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
