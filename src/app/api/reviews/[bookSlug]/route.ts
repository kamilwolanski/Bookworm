import { getBookReviews } from '@/lib/reviews';
import { NextResponse } from 'next/server';

type Params = {
  params: Promise<{
    bookSlug: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { bookSlug } = await params;

    if (!bookSlug) {
      return NextResponse.json({ error: 'Missing bookSlug' }, { status: 400 });
    }

    const response = await getBookReviews(bookSlug, {
      page: 1,
      pageSize: 3,
      onlyWithContent: true,
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error('API /api/editions error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
