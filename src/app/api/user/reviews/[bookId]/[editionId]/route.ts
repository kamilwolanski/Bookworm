import { getUserSession } from '@/lib/session';
import { getUserBookReview } from '@/lib/user';
import { NextResponse } from 'next/server';

type Params = {
  params: Promise<{
    bookId: string;
    editionId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { bookId, editionId } = await params;
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    if (!bookId) {
      return NextResponse.json({ error: 'Missing bookId' }, { status: 400 });
    }

    if (!editionId) {
      return NextResponse.json({ error: 'Missing editionId' }, { status: 400 });
    }

    const response = await getUserBookReview(userId, bookId, editionId);
    return NextResponse.json(response);
  } catch (err) {
    console.error('API /api/user/reviews/[bookId] error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
