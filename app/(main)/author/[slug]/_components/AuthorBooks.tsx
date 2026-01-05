import BookList from "@/components/homepage/BookList";
import { getAuthorsBooksCached } from "@/lib/author";

type AuthorBooksProps = {
  authorSlug: string;
  searchParams?: Promise<{
    page?: string;
  }>;
};
const ITEMS_PER_PAGE = 8;

export default async function AuthorBooks({
  authorSlug,
  searchParams,
}: AuthorBooksProps) {
  const { page } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || "1", 10);
  const { authorbooks, totalCount } = await getAuthorsBooksCached(authorSlug);
  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
      <h3 className="font-semibold mb-6">Książki autora</h3>
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:gap-10">
        <BookList
          books={authorbooks}
        />
      </div>
    </div>
  );
}
