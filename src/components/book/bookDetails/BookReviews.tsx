'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import RateBookDialog from '@/components/book/ratebook/RateBookDialog';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import BookReview from '@/components/book/bookDetails/BookReview';
import LoginDialog from '@/components/auth/LoginDialog';
import { ReviewItem } from '@/lib/reviews';
import { Suspense, useState } from 'react';
import DeleteReviewDialog from '@/components/book/bookDetails/DeleteReviewDialog';
import { Dialog } from '@/components/ui/dialog';
import {
  deleteReviewAction,
  DeleteReviewActionPayload,
} from '@/app/(main)/books/actions/reviewActions';
import { usePathname } from 'next/navigation';
import { useDeleteDialog } from '@/app/hooks/useDeleteDialog';
import { useBookReviews } from '@/app/hooks/books/useBookReviews';

const BookReviews = ({
  bookId,
  bookSlug,
  editionId,
  editionTitle,
  reviews,
  paginationData,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  editionTitle: string;
  reviews: Array<ReviewItem>;
  paginationData: {
    page: number;
    pageSize: number;
    total: number;
  };
}) => {
  const { status, data: session } = useSession();
  const userId = session?.user?.id;

  const {
    reviews: reviewsFromSWR,
    userReview,
    otherReviews,
    votesMap,
    userVotesMap,
    swrVotesKey,
    swrUserVotesKey,
  } = useBookReviews({
    bookSlug: bookSlug,
    sessionUserId: userId,
    initialReviews: reviews,
  });
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const pathname = usePathname();
  const swrKey = `/api/user/editions/${editionId}`;

  const [isPending, handleDelete, openDeleteDialog, setOpenDeleteDialog] =
    useDeleteDialog<DeleteReviewActionPayload>(
      deleteReviewAction,
      {
        reviewId: userReview?.id,
        bookId: bookId,
        pathname: pathname,
      },
      swrKey
    );

  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Opinie ({paginationData.total})</h3>
        {status === 'authenticated' ? (
          <RateBookDialog
            bookId={bookId}
            editionId={editionId}
            dialogTitle={`Napisz opinie o : ${editionTitle}`}
            userReview={userReview}
          >
            <Button variant="outline" className="bg-sidebar cursor-pointer">
              {userReview && userReview?.body
                ? 'Edytuj swoją opinię'
                : 'Napisz opinię'}
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

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DeleteReviewDialog
          onlyContent={true}
          dialogTitle={<>Czy na pewno chcesz usunąć tę opinię?</>}
          isPending={isPending}
          handleDelete={handleDelete}
        />
      </Dialog>

      <Dialog open={openReviewDialog} onOpenChange={setOpenReviewDialog}>
        <RateBookDialog
          bookId={bookId}
          editionId={editionId}
          dialogTitle={`Edytuj opinie o : ${editionTitle}`}
          userReview={userReview}
          onlyContent={true}
          afterSuccess={() => setOpenReviewDialog(false)}
        />
      </Dialog>

      {userReview && (
        <>
          <BookReview
            key={userReview.id}
            review={userReview}
            bookId={bookId}
            editionTitle={editionTitle}
            isOwner={true}
            setOpenDeleteDialog={setOpenDeleteDialog}
            setOpenReviewDialog={setOpenReviewDialog}
            votes={votesMap.get(userReview.id)}
            // loadingVotes={loadingVotes}
          />
        </>
      )}

      {otherReviews && otherReviews.length > 0 && (
        <>
          {otherReviews.map((review) => (
            <BookReview
              key={review.id}
              review={review}
              bookId={bookId}
              editionTitle={editionTitle}
              votes={votesMap.get(review.id)}
              userVoteType={userVotesMap.get(review.id)?.type}
              swrVotesKey={swrVotesKey}
              swrUserVotesKey={swrUserVotesKey}
            />
          ))}
        </>
      )}

      {reviewsFromSWR && (
        <>
          {reviewsFromSWR.length > 0 && (
            <Suspense>
              <PaginationWithLinks
                page={paginationData.page}
                pageSize={paginationData.pageSize}
                totalCount={paginationData.total}
                scrollOnPageChange={false}
              />
            </Suspense>
          )}

          {reviewsFromSWR.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              Brak opinii. Bądź pierwszy i napisz swoją opinię!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default BookReviews;
