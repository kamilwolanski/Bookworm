import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCardDTO } from "@/lib/books/listings";
import BookList from "./BookList";

interface BookSectionProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  variant: "white" | "grey";
  fetchBooks: () => Promise<BookCardDTO[]>;
}

export async function BookSection({
  title,
  subtitle,
  showViewAll = true,
  variant,
  fetchBooks,
}: BookSectionProps) {
  const books = await fetchBooks();

  return (
    <section
      className={`py-9 md:py-18 px-6 ${variant === "white" ? "bg-card" : ""}`}
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
          <BookList books={books} />
        </div>
      </div>
    </section>
  );
}
