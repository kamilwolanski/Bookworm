"use client";
import { useBookReviews } from "@/app/hooks/books/useBookReviews";
import { PaginationWithLinks } from "@/components/shared/PaginationWithLinks";
import { GetBookReviewsResult, ReviewItem } from "@/lib/reviews";
import { useState } from "react";
import BookReview from "./BookReview";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RateBookDialog from "@/components/book/ratebook/RateBookDialog";
import LoginDialog from "@/components/auth/LoginDialog";
import DeleteReviewDialog from "./DeleteReviewDialog";
import { useDeleteReviewDialog } from "@/app/hooks/useDeleteReviewDialog";
import { UserBookReview } from "@/lib/user";

type ReviewsClientProps = {
  bookSlug: string;
  bookId: string;
  editionId: string;
  currentPage: number;
  userId: string | undefined;
  reviewsResultFromServer: GetBookReviewsResult;
  userBookReviewFromServer: UserBookReview | null;
  editionTitle: {
    id: string;
    title: string | null;
}
};

export default function ReviewsClient({
  bookSlug,
  bookId,
  editionId,
  currentPage,
  userId,
  reviewsResultFromServer,
  userBookReviewFromServer,
  editionTitle
}: ReviewsClientProps) {
  const [editReviewId, setEditReviewId] = useState<string | null>(null);

  const {
    reviews,
    paginationData,
    userReviews,
    otherReviews,
    userVotesMap,
    swrUserVotesKey,
    userEditionReview,
    loadingUserVotes
  } = useBookReviews({
    bookSlug: bookSlug,
    editionId: editionId,
    userId: userId,
    page: currentPage,
    reviewsResultFromServer: reviewsResultFromServer,
    userBookReviewFromServer: userBookReviewFromServer,
  });

  const [isPending, handleDelete, deleteReviewId, setDeleteReviewId] =
    useDeleteReviewDialog(
      {
        bookId: bookId,
      },
      editionId,
      bookSlug,
      currentPage
    );

  const isLogIn = Boolean(userId);

  const userReviewForCurrentEdition = userReviews?.find(
    (review) => review.id === editReviewId
  );
  const toUserBookReview = (review: ReviewItem): UserBookReview => ({
    id: review.id,
    editionId: review.editionId,
    rating: review.rating,
    body: review.body,
  });

  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-3 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Opinie ({paginationData.total})</h3>
        {isLogIn ? (
          <RateBookDialog
            bookId={bookId}
            bookSlug={bookSlug}
            editionId={editionId}
            dialogTitle={`Napisz opinie o : ${editionTitle.title}`}
            userReview={userEditionReview ?? null}
          >
            <Button variant="outline" className="bg-sidebar cursor-pointer">
              {userReviews?.findIndex((r) => r.editionId === editionId) !== -1
                ? "Edytuj swoją opinię"
                : "Napisz opinię"}
            </Button>
          </RateBookDialog>
        ) : (
          <LoginDialog
            dialogTriggerBtn={
              <Button variant="outline" className="bg-sidebar cursor-pointer">
                Napisz opinię
              </Button>
            }
          />
        )}
      </div>

      <Dialog
        open={!!deleteReviewId}
        onOpenChange={(open) => {
          if (!open) setDeleteReviewId(null);
        }}
      >
        <DeleteReviewDialog
          onlyContent={true}
          dialogTitle={<>Czy na pewno chcesz usunąć tę opinię?</>}
          isPending={isPending}
          handleDelete={handleDelete}
        />
      </Dialog>

      <Dialog
        open={!!editReviewId}
        onOpenChange={(open) => {
          if (!open) setEditReviewId(null);
        }}
      >
        <RateBookDialog
          bookId={bookId}
          bookSlug={bookSlug}
          editionId={editionId}
          dialogTitle={`Edytuj opinie o : ${editionTitle.title}`}
          userReview={
            userReviewForCurrentEdition
              ? toUserBookReview(userReviewForCurrentEdition)
              : null
          }
          onlyContent={true}
          afterSuccess={() => setEditReviewId(null)}
        />
      </Dialog>

      {userReviews && userReviews.length > 0 && (
        <>
          {userReviews.map((userReview) => (
            <BookReview
              key={userReview.id}
              bookSlug={bookSlug}
              review={userReview}
              isOwner={true}
              setDeleteReviewId={setDeleteReviewId}
              setEditReviewId={setEditReviewId}
              isLogIn={isLogIn}
              currentPage={currentPage}
            />
          ))}
        </>
      )}

      {otherReviews && otherReviews.length > 0 && (
        <>
          {otherReviews.map((review) => (
            <BookReview
              key={review.id}
              bookSlug={bookSlug}
              review={review}
              userVoteType={userVotesMap.get(review.id)?.type}
              swrUserVotesKey={swrUserVotesKey}
              isLogIn={isLogIn}
              currentPage={currentPage}
              loadingUserVotes={loadingUserVotes}
            />
          ))}
        </>
      )}

      {reviews && (
        <>
          {reviews.length > 0 && (
            <PaginationWithLinks
              page={paginationData.page ?? 0}
              pageSize={paginationData.pageSize ?? 0}
              totalCount={paginationData.total ?? 0}
              scrollOnPageChange={false}
            />
          )}

          {reviews.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              Brak opinii. Bądź pierwszy i napisz swoją opinię!
            </p>
          )}
        </>
      )}
    </div>
  );
}
