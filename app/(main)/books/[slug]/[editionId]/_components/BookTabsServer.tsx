// BookTabsServer.tsx
import BookTabsClient from "./BookTabsClient";
import BookDescription from "./cached/BookDescription";
import OtherEditions from "./cached/OtherEditions";

export default function BookTabsServer({
  editionId,
  slug,
}: {
  editionId: string;
  slug: string;
}) {
  return (
    <BookTabsClient
      description={<BookDescription editionId={editionId} />}
      otherEditions={<OtherEditions bookSlug={slug} editionId={editionId} />}
      editionId={editionId}
    />
  );
}
