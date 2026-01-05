import { LANGUAGES } from "@/app/(admin)/admin/data";
import Emoji from "@/components/shared/Emoji";
import { getBookSpecs } from "@/lib/books";
import { MediaFormat } from "@prisma/client";

export default async function BookSpecs({ editionId }: { editionId: string }) {
  "use cache";
  const MediaFormatLabels: Record<MediaFormat, string> = {
    [MediaFormat.HARDCOVER]: "Twarda oprawa",
    [MediaFormat.PAPERBACK]: "Miękka oprawa",
    [MediaFormat.EBOOK]: "E-book",
    [MediaFormat.AUDIOBOOK]: "Audiobook",
  };
  const { edition, publishers } = await getBookSpecs(editionId);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
      <div className="space-y-2">
        {edition.format && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Format:</span>
            <span>{MediaFormatLabels[edition.format]}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Język:</span>
          <span className="flex gap-2">
            <Emoji>
              {LANGUAGES.find((l) => l.value === edition.language)?.icon ?? ""}
            </Emoji>{" "}
            (
            {LANGUAGES.find((l) => l.value === edition.language)?.label ??
              edition.language}
            )
          </span>
        </div>
        {edition.publicationDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data wydania:</span>
            <span>
              {new Date(edition.publicationDate).toLocaleDateString("pl-PL", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Liczba stron:</span>
          <span>{edition.pageCount}</span>
        </div>
        {edition.isbn13 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">ISBN 13:</span>
            <span className="text-sm">{edition.isbn13}</span>
          </div>
        )}
        {edition.isbn10 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">ISBN 10:</span>
            <span className="text-sm">{edition.isbn10}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Wydawca:</span>
          {publishers.map((p) => (
            <span key={p.slug}>{p.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
