import { getBookIdByEditionId, getEditionTitleCached } from "@/lib/books";
import { getUserSession } from "@/lib/session";
import { getTheUserBookData, getUserBookReview } from "@/lib/user";
import UserBookRating from "./userBookRating/UserBookRating";
import { getBookRating } from "@/lib/books/rating";
import BookRatingClient from "./BookRatingClient";
import BookReviewClient from "./BookReviewClient";
import UserBookStatusClient from "./UserBookStatusClient";
import ToggleToShelf from "./toggleToShelf/ToggleToShelf";
import BookDetailsBadges from "./BookDetailsBadges";

export default async function BookActions({
  bookSlug,
  editionId,
}: {
  bookSlug: string;
  editionId: string;
}) {
  const editionTitle = await getEditionTitleCached(editionId);
  const session = await getUserSession();
  const userId = session?.user?.id;

  const bookId = await getBookIdByEditionId(editionId);
  const bookRating = await getBookRating(bookId);
  let userReview = null;
  let userBookStatus = null;

  if (userId) {
    [userReview, userBookStatus] = await Promise.all([
      getUserBookReview(userId, editionId),
      getTheUserBookData(userId, bookId, editionId),
    ]);
  }

  const isLogIn = Boolean(userId);

  return (
    <>
      <UserBookRating
        isLogIn={isLogIn}
        bookId={bookId}
        editionId={editionId}
        bookSlug={bookSlug}
        userReviewFromServer={userReview}
      />
      <BookRatingClient bookSlug={bookSlug} bookRatingFromServer={bookRating} />
      <UserBookStatusClient
        userBookStatusFromServer={userBookStatus}
        bookSlug={bookSlug}
        bookId={bookId}
        editionId={editionId}
      />
      <div className="mt-5 flex gap-3 flex-wrap">
        <ToggleToShelf
          userBookStatusFromServer={userBookStatus}
          bookId={bookId}
          bookSlug={bookSlug}
          editionId={editionId}
          userId={userId}
        />

        <BookReviewClient
          isLogIn={isLogIn}
          bookId={bookId}
          editionId={editionId}
          bookSlug={bookSlug}
          userReviewFromServer={userReview}
          editionTitle={editionTitle.title}
        />
      </div>

      <BookDetailsBadges
        userBookStatusFromServer={userBookStatus}
        bookSlug={bookSlug}
        editionId={editionId}
      />
    </>
  );
}
