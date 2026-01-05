import { BookCardDTO } from "@/lib/books/listings";
import { BookCard } from "../book/BookCard";


async function BookList({
  books,
}: {
  books: BookCardDTO[];
}) {
  return books.map((item) => {
    return (
      <BookCard bookItem={item} key={item.representativeEdition.id} />
    );
  });
}
export default BookList;
