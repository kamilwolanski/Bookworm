"use cache";
import { getEditionDescription } from "@/lib/books";

export default async function BookDescription({
  editionId,
}: {
  editionId: string;
}) {

  const bookDescriptionResponse = await getEditionDescription(editionId);

  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-6">
      <div>
        <p className="text-sm  leading-relaxed">
          {bookDescriptionResponse.description}
        </p>
      </div>
    </div>
  );
}
