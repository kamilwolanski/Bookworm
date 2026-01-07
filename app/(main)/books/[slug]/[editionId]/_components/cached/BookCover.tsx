import { getEditionCover } from "@/lib/books";
import BookCoverImage from "../BookCover.client";

export default async function BookCover({
  editionId,
}: {
  editionId: string;
}) {
  "use cache";

  const editionCoverResponse = await getEditionCover(editionId);

  if (!editionCoverResponse.coverUrl) {
    return (
      <div className="w-[320px] h-112.5 rounded-md flex items-center justify-center text-sm text-muted-foreground">
        Brak okładki
      </div>
    );
  }

  return (
    <BookCoverImage coverUrl={editionCoverResponse.coverUrl} width={320} height={450} />
  );
}
