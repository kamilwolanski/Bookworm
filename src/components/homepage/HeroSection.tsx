'use client';

import { Search, Book, Users, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';

export function HeroSection() {
  const [value, setValue] = useState('');
  return (
    <section className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Text */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold  mb-6">
            Odkryj świat książek z
            <span className="text-primary"> BookWorm</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Znajdź swoją następną ulubioną książkę, oceniaj, pisz recenzje i
            dziel się opinią z społecznością miłośników literatury.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Czego szukasz?</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />

                <Input
                  placeholder="Wpisz tytuł książki, autora lub wydawnictwo..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-10 pr-12 py-5 text-sm md:text-base"
                />
              </div>
            </div>
            {value ? (
              <Link href={`/books/?search=${value}`}>
                <Button className="px-8 py-4 text-lg cursor-pointer">
                  Szukaj
                </Button>
              </Link>
            ) : (
              <Button className=" px-8 py-4 text-lg cursor-pointer" disabled>
                Szukaj
              </Button>
            )}
          </div>

          <div className="flex flex-wrap justify-center items-center text-sm text-muted-foreground">
            Popularne wyszukiwania:
            <Link href="/books?genre=fantasy">
              <Button className="ms-5 px-1" variant="link">
                &quot;fantasy&quot;
              </Button>
            </Link>
            <Link href="/books?search=tolkien">
              <Button className="px-1" variant="link">
                &quot;Tolkien&quot;
              </Button>
            </Link>
            <Link href="/books?genre=thriller">
              <Button className="px-1" variant="link">
                &quot;thriller&quot;
              </Button>
            </Link>
            <Link href="/books?search=chlopki">
              <Button className="px-1" variant="link">
                &quot;chlopki&quot;
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Book className="w-12 h-12 text-accent-2" />
            </div>
            <div className="text-2xl md:text-3xl font-bold">50,000+</div>
            <div className="text-muted-foreground">Książek w bazie</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Users className="w-12 h-12 text-accent-2" />
            </div>
            <div className="text-2xl md:text-3xl font-bold">25,000+</div>
            <div className="text-muted-foreground">Aktywnych czytelników</div>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Star className="w-12 h-12 text-accent-2" />
            </div>
            <div className="text-2xl md:text-3xl font-bold">100,000+</div>
            <div className="text-muted-foreground">Ocen i recenzji</div>
          </div>
        </div>
      </div>
    </section>
  );
}
