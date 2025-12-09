import { getUserSession } from '@/lib/session';
import { getUserBookReviewsVotes } from '@/lib/user';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { reviewIds }: { reviewIds: string[] } = await req.json();

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing userId or reviewIds' },
        { status: 400 }
      );
    }

    const response = await getUserBookReviewsVotes(userId, reviewIds);

    return NextResponse.json(response);
  } catch (err) {
    console.error('API /api/user/reviews/user-votes', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
