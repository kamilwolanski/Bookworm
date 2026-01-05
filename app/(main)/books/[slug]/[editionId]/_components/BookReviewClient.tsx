"use client";

import { UserBookReview } from "@/lib/user";
import useSWR from "swr";
import RateBookDialog from "@/components/book/ratebook/RateBookDialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import LoginDialog from "@/components/auth/LoginDialog";

export default function BookReviewClient({
  isLogIn,
  bookId,
  editionId,
  bookSlug,
  userReviewFromServer,
  editionTitle,
}: {
  isLogIn: boolean;
  bookId: string;
  editionId: string;
  bookSlug: string;
  userReviewFromServer: UserBookReview | null;
  editionTitle: string | null;
}) {
  const { data: userReview = userReviewFromServer } =
    useSWR<UserBookReview | null>(`/api/editions/${editionId}/reviews/me`, {
      fallbackData: userReviewFromServer,
    });

  if (!isLogIn) {
    return (
      <LoginDialog
        dialogTriggerBtn={
          <Button variant="outline" className="cursor-pointer">
            <Star className="w-4 h-4 mr-1" />
            Oceń
          </Button>
        }
      />
    );
  }

  return (
    <RateBookDialog
      bookId={bookId}
      bookSlug={bookSlug}
      editionId={editionId}
      dialogTitle={`Napisz opinie o: ${editionTitle}`}
      userReview={userReview}
    >
      <Button variant="outline" className="cursor-pointer">
        <Star className="w-4 h-4 mr-1" />
        {userReview ? "Edytuj ocenę" : "Oceń"}
      </Button>
    </RateBookDialog>
  );
}
