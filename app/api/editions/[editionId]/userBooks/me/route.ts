import { getUserSession } from "@/lib/session";
import { getTheUserInformationForEdition } from "@/lib/user";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    editionId: string;
  }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { editionId } = await params;
    const session = await getUserSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    if (!editionId) {
      return NextResponse.json({ error: "Missing editionId" }, { status: 400 });
    }

    const response = await getTheUserInformationForEdition(userId, editionId);
    return NextResponse.json(response);
  } catch (err) {
    console.error("API /api/editions/[editionId]/userBooks/me error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
