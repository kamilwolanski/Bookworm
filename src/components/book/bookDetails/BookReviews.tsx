'use client';

import { Button } from '@/components/ui/button';
import RateBookDialog from '@/components/book/ratebook/RateBookDialog';
import { PaginationWithLinks } from '@/components/shared/PaginationWithLinks';
import { ReviewItem } from '@/lib/userbooks';
import BookReview from '@/components/book/bookDetails/BookReview';

const BookReviews = ({
  bookId,
  bookSlug,
  editionId,
  editionTitle,
  reviews,
  userReview,
  paginationData,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  editionTitle: string;
  userReview?: {
    editionId: string;
    rating: number | null;
    body: string | null;
  };
  reviews: Array<ReviewItem>;
  paginationData: {
    page: number;
    pageSize: number;
    total: number;
  };
}) => {
  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Opinie ({paginationData.total})</h3>

        <RateBookDialog
          bookId={bookId}
          editionId={editionId}
          dialogTitle={`Napisz opinie o : ${editionTitle}`}
          userReview={userReview}
        >
          <Button variant="outline" className="bg-sidebar cursor-pointer">
            {userReview ? 'Edytuj swoją opinię' : 'Napisz opinię'}
          </Button>
        </RateBookDialog>
      </div>
      {reviews.length > 0 ? (
        <>
          {reviews.map((review) => (
            <BookReview key={review.id} review={review} bookSlug={bookSlug} />
          ))}
          <PaginationWithLinks
            page={paginationData.page}
            pageSize={paginationData.pageSize}
            totalCount={paginationData.total}
            scrollOnPageChange={false}
          />
        </>
      ) : (
        <p className="text-center py-8 text-muted-foreground">
          Brak opinii. Bądź pierwszy i napisz swoją opinię!
        </p>
      )}
    </div>
  );
};

export default BookReviews;
