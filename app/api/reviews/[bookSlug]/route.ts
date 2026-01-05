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
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? 1);
    if (!bookSlug) {
      return NextResponse.json({ error: 'Missing bookSlug' }, { status: 400 });
    }

    const response = await getBookReviews(bookSlug, {
      page: page,
      pageSize: 3,
      onlyWithContent: true,
    });

    return NextResponse.json(response);
  } catch (err) {
    console.error('API /api/reviews/ error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
