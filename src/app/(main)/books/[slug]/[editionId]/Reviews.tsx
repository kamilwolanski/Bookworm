import BookReviews from '@/components/book/bookDetails/BookReviews';
import { getBookReviews } from '@/lib/userbooks';

export default async function ReviewsServer({
  slug,
  page,
  bookId,
  editionId,
  userReview,
  currentPage,
  editionTitle,
}: {
  slug: string;
  page: number;
  bookId: string;
  editionId: string;
  userReview?: {
    editionId: string;
    rating: number | null;
    body: string | null;
  };
  currentPage: number;
  editionTitle: string;
}) {
  const reviewsResponse = await getBookReviews(slug, {
    page,
    pageSize: 2,
    onlyWithContent: true,
  });

  return (
    <BookReviews
      bookId={bookId}
      bookSlug={slug}
      editionId={editionId}
      editionTitle={editionTitle}
      //   userReview={book.userBook?.userReview}
      userReview={userReview}
      reviews={reviewsResponse.items}
      paginationData={{
        page: currentPage,
        pageSize: reviewsResponse.pageSize,
        total: reviewsResponse.total,
      }}
    />
  );
}
