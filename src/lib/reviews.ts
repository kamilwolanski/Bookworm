import { MediaFormat, Review, ReviewVoteType } from '@prisma/client';
import { getUserSession } from '@/lib/session';
import prisma from '@/lib/prisma';

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

export type RatePayload = {
  bookId: string;
  editionId: string;
  rating?: number;
  body?: string;
};

export type DeleteReviewPayload = { reviewId: string; bookId: string };

export async function getBookReviews(
  bookSlug: string,
  {
    page = 1,
    pageSize = 20,
    onlyWithContent = false,
  }: GetBookReviewsOptions = {}
): Promise<GetBookReviewsResult> {
  const session = await getUserSession();
  const currentUserId = session?.user?.id ?? null;

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

export async function updateBookRating(
  userId: string,
  { editionId, bookId, rating, body }: RatePayload
): Promise<void> {
  // walidacja: tylko jeśli rating został przekazany
  if (rating != null) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error('Rating must be an integer between 1 and 5.');
    }
  }

  await prisma.$transaction(async (tx) => {
    // Upsert recenzji użytkownika dla danej EDYCJI
    await tx.review.upsert({
      where: { userId_editionId: { userId, editionId } },
      create: { editionId, userId, rating, body },
      update: { rating, body },
    });

    // 🔧 Agregaty dla CAŁEJ KSIĄŻKI (po wszystkich edycjach)
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
