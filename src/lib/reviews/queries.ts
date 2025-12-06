import { getUserSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import {
  GetBookReviewsOptions,
  GetBookReviewsResult,
  ReviewItem,
} from './types';

export async function getBookReviewsDeprecated(
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
        user: { select: { id: true, name: true, image: true } },
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
            user: { select: { id: true, name: true, image: true } },
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
  {
    page = 1,
    pageSize = 20,
    onlyWithContent = false,
  }: GetBookReviewsOptions = {}
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

  const skip = (page - 1) * pageSize;

  const bookReviews = await prisma.review.findMany({
    where: baseWhere,
    skip: skip,
    take: pageSize,
    select: {
      id: true,
      editionId: true,
      body: true,
      rating: true,
      createdAt: true,
      votes: {
        select: {
          userId: true,
          type: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const items: ReviewItem[] = bookReviews.map((review) => {
    const user = review.user;
    return {
      id: review.id,
      editionId: review.editionId,
      rating: review.rating,
      body: review.body,
      createdAt: review.createdAt,
      user: user,
      votes: {
        likes: review.votes.reduce(
          (acc, vote) => acc + (vote.type === 'LIKE' ? 1 : 0),
          0
        ),
        dislikes: review.votes.reduce(
          (acc, vote) => acc + (vote.type === 'DISLIKE' ? 1 : 0),
          0
        ),
      },
    };
  });

  return { items, total, page, pageSize };
}
