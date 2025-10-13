import { MediaFormat, Review, ReviewVoteType } from '@prisma/client';
import { getUserSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export type VoteState = {
  myVote?: ReviewVoteType | null;
  likes: number;
  dislikes: number;
};

export type ReviewItem = Review & {
  user: { id: string; name: string | null; avatarUrl: string | null };
  edition: {
    id: string;
    language: string | null;
    format: MediaFormat | null;
  };
  isOwner: boolean;
  votes: VoteState;
};

type GetBookReviewsResult = {
  items: Array<ReviewItem>;
  total: number;
  page: number;
  pageSize: number;
};

type GetBookReviewsOptions = {
  page?: number;
  pageSize?: number;
  onlyWithContent?: boolean;
};

export type DeleteReviewPayload = { reviewId: string; bookId: string };

async function _getBookReviewsRaw(
  bookSlug: string,
  {
    page = 1,
    pageSize = 20,
    onlyWithContent = false,
  }: GetBookReviewsOptions = {},
  currentUserId: string | null // <— nowy argument
): Promise<GetBookReviewsResult> {
  const contentWhere = onlyWithContent
    ? { AND: [{ body: { not: null } }, { body: { not: '' } }] }
    : {};

  const baseWhere = {
    edition: { book: { slug: bookSlug } },
    ...contentWhere,
  } as const;

  // total wszystkich recenzji (owner + others)
  const total = await prisma.review.count({ where: baseWhere });

  // OWNER — wszystkie recenzje użytkownika (jeśli zalogowany)
  let ownerReviews: ReviewItem[] = [];
  let ownerCount = 0;

  if (currentUserId) {
    const rawOwner = await prisma.review.findMany({
      where: { ...baseWhere, userId: currentUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        edition: { select: { id: true, language: true, format: true } },
        votes: true,
      },
    });

    ownerCount = rawOwner.length;

    ownerReviews = rawOwner.map((r) => ({
      ...r,
      isOwner: true,
      votes: {
        myVote: r.votes.find((v) => v.userId === currentUserId)?.type ?? null,
        likes: r.votes.reduce((acc, v) => acc + (v.type === 'LIKE' ? 1 : 0), 0),
        dislikes: r.votes.reduce(
          (acc, v) => acc + (v.type === 'DISLIKE' ? 1 : 0),
          0
        ),
      },
    }));
  }

  // Paginuje po [owner..., others...]
  // Indeks startowy w łącznej liście:
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // Część właściciela na tej stronie
  const ownerSliceStart = Math.max(0, Math.min(ownerCount, start));
  const ownerSliceEnd = Math.max(0, Math.min(ownerCount, end));
  const ownerTaken = Math.max(0, ownerSliceEnd - ownerSliceStart);

  const ownerPageItems =
    ownerTaken > 0 ? ownerReviews.slice(ownerSliceStart, ownerSliceEnd) : [];

  // Ile potrzebujemy „others” na tę stronę
  const needOthers = pageSize - ownerTaken;

  // Skip/Ta​ke dla „others” w łącznej kolejce zaczyna się po ownerCount
  // Jeśli start < ownerCount — część strony zjada owner; resztę bierzemy od początku „others”.
  // Jeśli start >= ownerCount — w całości lecimy po „others” z offsetem (start - ownerCount).
  const othersGlobalStart = Math.max(0, start - ownerCount);
  const othersSkip = othersGlobalStart + (ownerTaken > 0 ? 0 : 0); // jawnie

  // Pobieramy tylko tyle, ile trzeba na tę stronę
  const rawOthers =
    needOthers > 0
      ? await prisma.review.findMany({
          where: currentUserId
            ? { ...baseWhere, userId: { not: currentUserId } }
            : baseWhere,
          orderBy: { createdAt: 'desc' },
          skip: othersSkip,
          take: needOthers,
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
            edition: { select: { id: true, language: true, format: true } },
            votes: true,
          },
        })
      : [];

  const otherItems: ReviewItem[] = rawOthers.map((r) => ({
    ...r,
    isOwner: false,
    votes: {
      myVote: r.votes.find((v) => v.userId === currentUserId)?.type ?? null,
      likes: r.votes.reduce((acc, v) => acc + (v.type === 'LIKE' ? 1 : 0), 0),
      dislikes: r.votes.reduce(
        (acc, v) => acc + (v.type === 'DISLIKE' ? 1 : 0),
        0
      ),
    },
  }));

  const items: ReviewItem[] = [...ownerPageItems, ...otherItems];

  return { items, total, page, pageSize };
}

export async function getBookReviews(
  bookSlug: string,
  opts: GetBookReviewsOptions = {}
): Promise<GetBookReviewsResult> {
  const session = await getUserSession();
  const currentUserId = session?.user?.id ?? null;
  const key = [
    'reviews',
    bookSlug,
    String(opts.page ?? 1),
    String(opts.pageSize ?? 20),
    String(!!opts.onlyWithContent),
  ];

  // ważne: tag zależny od sluga
  const cached = unstable_cache(
    async () => _getBookReviewsRaw(bookSlug, opts, currentUserId),
    key,
    { tags: [`reviews:${bookSlug}`] }
  );
  console.log('Cache key:', key, 'tags:', [`reviews:${bookSlug}`]);
  return cached();
}

export async function deleteReview(
  userId: string,
  { reviewId, bookId }: DeleteReviewPayload
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await prisma.review.delete({
      where: {
        id: reviewId,
        userId,
      },
    });
    const aggs = await tx.review.aggregate({
      where: { edition: { bookId } }, // <— kluczowa zmiana
      _avg: { rating: true },
      _count: { rating: true }, // liczy tylko nie-NULL
    });

    const avg =
      aggs._avg.rating == null ? null : Number(aggs._avg.rating.toFixed(2));
    const count = aggs._count.rating;

    await tx.book.update({
      where: { id: bookId },
      data: {
        averageRating: avg, // możesz trzymać null gdy brak ocen
        ratingCount: count,
      },
    });
  });
}
