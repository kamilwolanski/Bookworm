import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Najpierw dodaj gatunki (genres)
  const genres = [
    { slug: 'fantasy', translations: [{ language: 'pl', name: 'Fantastyka' }] },
    {
      slug: 'science-fiction',
      translations: [{ language: 'pl', name: 'Science Fiction' }],
    },
    { slug: 'thriller', translations: [{ language: 'pl', name: 'Thriller' }] },
    { slug: 'romance', translations: [{ language: 'pl', name: 'Romans' }] },
    {
      slug: 'non-fiction',
      translations: [{ language: 'pl', name: 'Literatura faktu' }],
    },
  ];

  for (const genreData of genres) {
    await prisma.genre.upsert({
      where: { slug: genreData.slug },
      update: {},
      create: {
        slug: genreData.slug,
        translations: {
          create: genreData.translations,
        },
      },
    });
  }

  console.log('Seeded genres and translations');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
