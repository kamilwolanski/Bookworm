import Image from "next/image";
import { getEditionCover } from "@/lib/books";

export default async function BookCover({ editionId }: { editionId: string }) {
  "use cache";

  const editionCoverResponse = await getEditionCover(editionId);

  if (!editionCoverResponse.coverUrl) {
    return (
      <div className="w-[320px] h-105 rounded-md flex items-center justify-center text-sm text-muted-foreground">
        Brak okładki
      </div>
    );
  }

  return (
    <Image
      src={editionCoverResponse.coverUrl}
      alt={editionCoverResponse.title ?? ""}
      width={320}
      height={420}
      className="rounded-md object-cover mx-auto"
    />
  );
}
