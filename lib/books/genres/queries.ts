import prisma from "@/lib/prisma";
import { GenreDTO } from "./types";
import { unstable_cache } from "next/cache";

export const getBookGenresCached = (language: "pl" | "en") =>
  unstable_cache(
    async () => {
      return getBookGenres(language);
    },
    ["book-genres", language],
    {
      revalidate: 60 * 60 * 24 * 30, // 30 days
    }
  )();

export async function getBookGenres(
  language: "pl" | "en"
): Promise<GenreDTO[]> {
  const genres = await prisma.genre.findMany({
    include: {
      translations: {
        where: {
          language: language,
        },
        take: 1,
      },
    },
  });

  return genres.map((genre) => {
    const translation = genre.translations[0];

    return {
      id: genre.id,
      slug: genre.slug,
      language: translation.language,
      name: translation.name,
    };
  });
}
