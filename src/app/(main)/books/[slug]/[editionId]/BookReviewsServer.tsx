import BookReviews from '@/components/book/bookDetails/BookReviews';
import { getBookReviews } from '@/lib/reviews';

type BookReviewsServerProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
  slug: string;
  editionId: string;
  bookId: string;
  editionTitle: string;
};

const BookReviewsServer = async ({
  searchParams,
  slug,
  bookId,
  editionId,
  editionTitle,
}: BookReviewsServerProps) => {
  const { page } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const reviewsResponse = await getBookReviews(slug, {
    page: 1,
    pageSize: 3,
    onlyWithContent: true,
  });

  return (
    <BookReviews
      bookId={bookId}
      bookSlug={slug}
      editionId={editionId}
      editionTitle={editionTitle}
      reviews={reviewsResponse.items}
      paginationData={{
        page: currentPage,
        pageSize: reviewsResponse.pageSize,
        total: reviewsResponse.total,
      }}
    />
  );
};

export default BookReviewsServer;
