import { getBookGenresCached } from "@/lib/books";
import FiltersPanel from "../FiltersPanel";
import { getUserSession } from "@/lib/session";

const BookFilters = async () => {
  const bookGenres = await getBookGenresCached("pl");
  const session = await getUserSession();
  const userId = session?.user?.id;
  const isLogIn = Boolean(userId);

  return (
      <FiltersPanel bookGenres={bookGenres} isLogIn={isLogIn} />
  );
};

export default BookFilters;
