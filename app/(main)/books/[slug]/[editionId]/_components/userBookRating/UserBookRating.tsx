import { UserBookReview } from "@/lib/user";
import UserBookRatingClient from "@/app/(main)/books/[slug]/[editionId]/_components/userBookRating/UserBookRatingClient";
import LoginDialog from "@/components/auth/LoginDialog";
import { Star } from "lucide-react";

export default async function UserBookRating({
  isLogIn,
  bookId,
  editionId,
  bookSlug,
  userReviewFromServer,
}: {
  isLogIn: boolean;
  bookId: string;
  editionId: string;
  bookSlug: string;
  userReviewFromServer: UserBookReview | null;
}) {
  if (!isLogIn) {
    return (
      <div className="mt-3 flex items-center gap-3">
        <p>
          <b>Twoja ocena: </b>
        </p>
        <LoginDialog
          dialogTriggerBtn={
            <button type="button" className="relative flex gap-1">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  className="w-5 h-5 text-gray-300 cursor-pointer"
                />
              ))}
            </button>
          }
        />
      </div>
    );
  }
  return (
    <div className="mt-3 flex items-center gap-3">
      <p>
        <b>Twoja ocena: </b>
      </p>

      <UserBookRatingClient
        bookId={bookId}
        bookSlug={bookSlug}
        editionId={editionId}
        userReviewFromServer={userReviewFromServer}
      />
    </div>
  );
}
