import { getTheUserInformationForEditions } from '@/lib/books';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, editionIds }: { userId: string; editionIds: string[] } =
      await req.json();

    if (!userId || !Array.isArray(editionIds)) {
      return NextResponse.json(
        { error: 'Missing userId or editionIds' },
        { status: 400 }
      );
    }

    const response = await getTheUserInformationForEditions(userId, editionIds);

    return NextResponse.json({ data: response });
  } catch (err) {
    console.error('API /api/editions error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
