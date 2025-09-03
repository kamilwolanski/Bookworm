// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'POPULAR_SCIENCE';
  const language = 'pl';
  const namePl = 'Popularnonaukowa ';

  // 1) Upewnij się, że istnieje gatunek o slug=reportaz
  const genre = await prisma.genre.upsert({
    where: { slug },
    update: {}, // brak zmian przy istnieniu — zachowujemy idempotencję
    create: {
      slug,
      translations: {
        create: { language, name: namePl },
      },
    },
    include: { translations: true },
  });

  // 2) Upewnij się, że istnieje tłumaczenie PL (gdy gatunek istniał wcześniej bez tłumaczenia)
  await prisma.genreTranslation.upsert({
    where: {
      // @@unique([genreId, language]) -> pole złożone w Prisma: genreId_language
      genreId_language: { genreId: genre.id, language },
    },
    update: { name: namePl },
    create: { genreId: genre.id, language, name: namePl },
  });

  console.log(`OK ✅  Gatunek "${namePl}" (slug: ${slug}) jest w bazie.`);
}

main()
  .catch((e) => {
    console.error('Błąd podczas seedowania:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
