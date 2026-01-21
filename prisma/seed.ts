// prisma/seed.ts

import prisma from "../lib/prisma";

type SeedGenre = {
  slug: string;
  pl: { name: string; name_search: string };
};

const GENRES: SeedGenre[] = [
  {
    slug: "post-apocalyptic",
    pl: { name: "Postapokalipsa", name_search: "postapokalipsa" },
  },
  {
    slug: "space-opera",
    pl: { name: "Space opera", name_search: "space opera" },
  },
  {
    slug: "cyberpunk",
    pl: { name: "Cyberpunk", name_search: "cyberpunk" },
  },
  {
    slug: "steampunk",
    pl: { name: "Steampunk", name_search: "steampunk" },
  },
  {
    slug: "military-sci-fi",
    pl: { name: "Militarne science fiction", name_search: "militarne science fiction" },
  },
  {
    slug: "romantasy",
    pl: { name: "Romantasy", name_search: "romantasy" },
  },
  {
    slug: "cozy-mystery",
    pl: { name: "Przytulny kryminał", name_search: "przytulny kryminal" },
  },
  {
    slug: "historical-romance",
    pl: { name: "Romans historyczny", name_search: "romans historyczny" },
  },
  {
    slug: "personal-finance",
    pl: { name: "Finanse osobiste", name_search: "finanse osobiste" },
  },
  {
    slug: "domestic-fiction",
    pl: { name: "Literatura obyczajowa", name_search: "literatura obyczajowa" },
  },
];

async function main() {
  for (const g of GENRES) {
    // 1) Genre (po slug)
    const genre = await prisma.genre.upsert({
      where: { slug: g.slug },
      create: { slug: g.slug },
      update: {}, // nic nie zmieniamy, ale zapewnia idempotencję
      select: { id: true },
    });

    // 2) GenreTranslation (po @@unique([genreId, language]))
    await prisma.genreTranslation.upsert({
      where: {
        genreId_language: {
          genreId: genre.id,
          language: "pl",
        },
      },
      create: {
        genreId: genre.id,
        language: "pl",
        name: g.pl.name,
        name_search: g.pl.name_search,
      },
      update: {
        name: g.pl.name,
        name_search: g.pl.name_search,
      },
    });
  }

  console.log(`Seeded ${GENRES.length} genres (+ PL translations).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
