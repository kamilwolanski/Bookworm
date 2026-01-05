import { getUserSession } from "@/lib/session";
import { getUserBookReview } from "@/lib/user";
import UserEditionRatingClient from "./UserEditionRatingClient";

export default async function UserEditionRating({
  editionId,
}: {
  editionId: string;
}) {
  const session = await getUserSession();
  const userId = session?.user?.id || null;

  if (!userId) {
    return null;
  }
  const responseUserEditionRating = userId
    ? await getUserBookReview(userId, editionId)
    : null;


  return (
    <UserEditionRatingClient
      editionId={editionId}
      userEditionRatingFromServer={responseUserEditionRating}
    />
  );
}
