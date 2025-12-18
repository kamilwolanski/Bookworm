'use client';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import RateBookDialog from '@/components/book/ratebook/RateBookDialog';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import BookReview from '@/components/book/bookDetails/BookReview';
import LoginDialog from '@/components/auth/LoginDialog';
import { useState } from 'react';
import DeleteReviewDialog from '@/components/book/bookDetails/DeleteReviewDialog';
import { Dialog } from '@/components/ui/dialog';
import { usePathname } from 'next/navigation';
import { useDeleteReviewDialog } from '@/app/hooks/useDeleteReviewDialog';
import { useBookReviews } from '@/app/hooks/books/useBookReviews';
import { useSearchParams } from 'next/navigation';
import BookReviewsSkeleton from './placeholders/BookReviewsSkeleton';

const BookReviews = ({
  bookId,
  bookSlug,
  editionId,
  editionTitle,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  editionTitle: string;
}) => {
  const { status, data: session } = useSession();
  const userId = session?.user?.id;
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const {
    reviews,
    paginationData,
    userReviews,
    otherReviews,
    votesMap,
    userVotesMap,
    swrVotesKey,
    swrUserVotesKey,
    userEditionReview,
    isLoading,
  } = useBookReviews({
    bookSlug: bookSlug,
    bookId: bookId,
    editionId: editionId,
    sessionUserId: userId,
    page: page,
  });
  const [editReviewId, setEditReviewId] = useState<string | null>(null);

  const pathname = usePathname();

  const [isPending, handleDelete, deleteReviewId, setDeleteReviewId] =
    useDeleteReviewDialog(
      {
        bookId: bookId,
        pathname: pathname,
      },
      editionId,
      bookSlug
    );

  if (isLoading || status === 'loading') return <BookReviewsSkeleton />;
  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Opinie ({paginationData.total})</h3>
        {status === 'authenticated' ? (
          <RateBookDialog
            bookId={bookId}
            bookSlug={bookSlug}
            editionId={editionId}
            dialogTitle={`Napisz opinie o : ${editionTitle}`}
            userReview={userEditionReview}
          >
            <Button variant="outline" className="bg-sidebar cursor-pointer">
              {userReviews?.findIndex((r) => r.editionId === editionId) !== -1
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
          dialogTitle={`Edytuj opinie o : ${editionTitle}`}
          userReview={userReviews?.find((review) => review.id === editReviewId)}
          onlyContent={true}
          afterSuccess={() => setEditReviewId(null)}
        />
      </Dialog>

      {userReviews && userReviews.length > 0 && (
        <>
          {userReviews.map((userReview) => (
            <BookReview
              key={userReview.id}
              review={userReview}
              bookId={bookId}
              editionTitle={editionTitle}
              isOwner={true}
              setDeleteReviewId={setDeleteReviewId}
              setEditReviewId={setEditReviewId}
              votes={votesMap.get(userReview.id)}
              // loadingVotes={loadingVotes}
            />
          ))}
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
};

export default BookReviews;
