import { getBookRating } from "@/lib/books/rating";
import AverageRatingClient from "./AverageRatingClient";

export default async function AverageRating({
  bookId,
  bookSlug,
}: {
  bookId: string;
  bookSlug: string;
}) {
  const rating = await getBookRating(bookId);
  return (
    <AverageRatingClient bookSlug={bookSlug} bookRatingFromServer={rating} />
  );
}
