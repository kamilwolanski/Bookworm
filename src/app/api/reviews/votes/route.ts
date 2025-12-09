import { getReviewsVotes } from '@/lib/reviews';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { reviewIds }: { reviewIds: string[] } = await req.json();

    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json({ error: 'Missing reviewIds' }, { status: 400 });
    }

    const response = await getReviewsVotes(reviewIds);

    return NextResponse.json(response);
  } catch (err) {
    console.error('API /api/reviews/votes', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
