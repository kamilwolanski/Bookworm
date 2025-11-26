import { getTheUserInformationForEditions } from '@/lib/userbooks';
import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/session';
export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { editionIds }: { editionIds: string[] } = await req.json();

    if (!Array.isArray(editionIds) || editionIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing userId or editionIds' },
        { status: 400 }
      );
    }

    const response = await getTheUserInformationForEditions(userId, editionIds);

    return NextResponse.json(response);
  } catch (err) {
    console.error('API /api/editions error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
