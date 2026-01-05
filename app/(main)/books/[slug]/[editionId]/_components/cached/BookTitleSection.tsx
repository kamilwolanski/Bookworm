import { getBookTitleSectionData } from "@/lib/books";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { genreColorMap } from "@/lib/genreColorMap";

export default async function BookTitleSection({ editionId }: { editionId: string }) {
  "use cache";

  const { title, subtitle, authors, genres } = await getBookTitleSectionData(
    editionId
  );

  return (
    <>
      <h2 className="text-lg font-semibold flex-1">{title}</h2>
      {subtitle && <h3>{subtitle}</h3>}
      <div className="mt-3">
        {authors.map((a, i) => (
          <div key={i}>
            <Link
              key={a.slug}
              href={`/author/${a.slug}`}
              className="underline underline-offset-2 text-link hover:text-link-hover"
            >
              {a.name}
            </Link>
            {i < authors.length - 1 && ", "}
          </div>
        ))}
      </div>
      {genres && (
        <div className="mt-4">
          {genres.map((genre, index) => {
            return (
              <Badge
                key={genre.slug}
                className={`${index > 0 ? "ms-2" : ""} ${
                  genreColorMap[genre.slug]
                }`}
              >
                {genre.name}
              </Badge>
            );
          })}
        </div>
      )}
    </>
  );
}