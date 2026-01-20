import { getUserSession } from "@/lib/session";
import { getBookIdBySlug, getTheUserBookData } from "@/lib/user";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    slug: string;
    editionId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug, editionId } = await params;
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    if (!editionId) {
      return NextResponse.json({ error: "Missing editionId" }, { status: 400 });
    }

    const book = await getBookIdBySlug(slug);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const userBook = await getTheUserBookData(
      session.user.id,
      book.id,
      editionId
    );

    return NextResponse.json(userBook);
  } catch (err) {
    console.error(
      "API /api/me/books/[slug]/editions/[editionId] rating error",
      err
    );
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
