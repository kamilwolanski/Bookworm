import { getBookReviews } from "@/lib/reviews";
import ReviewsClient from "./ReviewsClient";
import { getUserSession } from "@/lib/session";
import { getBookIdBySlug, getUserBookReview } from "@/lib/user";
import { getEditionTitleCached } from "@/lib/books";

type ReviewsProps = {
  bookSlug: string;
  editionId: string;
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function Reviews({
  bookSlug,
  editionId,
  searchParams,
}: ReviewsProps) {
  const { page } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || "1", 10);
  const session = await getUserSession();
  const userId = session?.user?.id;
  const userBookReview = userId
    ? await getUserBookReview(userId, editionId)
    : null;
  const [reviewsResult, book, editionTitle] = await Promise.all([
    getBookReviews(bookSlug, {
      page: currentPage,
      pageSize: 3,
      onlyWithContent: true,
    }),
    getBookIdBySlug(bookSlug),
    getEditionTitleCached(editionId)
  ]);

  return (
    <ReviewsClient
      bookSlug={bookSlug}
      bookId={book.id}
      editionId={editionId}
      currentPage={currentPage}
      userId={userId}
      reviewsResultFromServer={reviewsResult}
      userBookReviewFromServer={userBookReview}
      editionTitle={editionTitle}
    />
  );
}
