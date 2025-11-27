import { getUserSession } from '@/lib/session';
import { getUserBookReviews } from '@/lib/userbooks';
import { NextResponse } from 'next/server';

type Params = {
  params: Promise<{
    bookId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { bookId } = await params;
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    if (!bookId) {
      return NextResponse.json({ error: 'Missing bookId' }, { status: 400 });
    }

    const response = await getUserBookReviews(userId, bookId);

    return NextResponse.json(response);
  } catch (err) {
    console.error('API /api/editions error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
