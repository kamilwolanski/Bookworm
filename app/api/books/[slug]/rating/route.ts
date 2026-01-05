import { getBookRating } from '@/lib/books/rating';
import { getBookIdBySlug } from '@/lib/user';
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
    const book = await getBookIdBySlug(slug);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const rating = await getBookRating(book.id);
    if (!rating) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(rating);
  } catch (err) {
    console.error('API /api/books/[slug]/rating error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
