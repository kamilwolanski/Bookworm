import { getBookRating } from '@/lib/books/rating';
import { NextResponse } from 'next/server';

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
    }

    const rating = await getBookRating(slug);
    if (!rating) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(rating);
  } catch (err) {
    console.error('API /api/books/[slug]/rating error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
