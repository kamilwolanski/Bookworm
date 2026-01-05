import { getUserSession } from "@/lib/session";
import SearchPanel from "./SearchPanel";
import { getBookGenresCached } from "@/lib/books";

const SearchHeader = async () => {
  const bookGenres = await getBookGenresCached("pl");
  const session = await getUserSession();
  const userId = session?.user?.id;
  const isLogIn = Boolean(userId);

  return (
      <SearchPanel isLogIn={isLogIn} bookGenres={bookGenres} />
  );
};

export default SearchHeader;
