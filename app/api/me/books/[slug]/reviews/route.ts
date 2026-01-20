import { getUserSession } from "@/lib/session";
import { getBookIdBySlug, getUserBookReviews } from "@/lib/user";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const userId = session.user.id;
    const book = await getBookIdBySlug(slug);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const response = await getUserBookReviews(userId, book.id);

    return NextResponse.json(response);
  } catch (err) {
    console.error("API /api/me/books/[slug]/reviews error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
