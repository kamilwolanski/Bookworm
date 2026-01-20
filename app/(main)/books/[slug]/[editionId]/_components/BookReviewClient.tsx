"use client";

import { UserBookReview } from "@/lib/user";
import useSWR from "swr";
import RateBookDialog from "@/components/book/ratebook/RateBookDialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import LoginDialog from "@/components/auth/LoginDialog";
import { useMemo } from "react";

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
    const shouldFetch = isLogIn;
    const key = useMemo(
      () =>
        shouldFetch
          ? `/api/me/editions/${editionId}/reviews`
          : null,
      [editionId, shouldFetch],
    );
  const { data: userReview = userReviewFromServer } =
    useSWR<UserBookReview | null>(key, {
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
