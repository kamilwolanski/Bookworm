import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test book...");

  // 1. Genre
  const genre = await prisma.genre.upsert({
    where: { slug: "fantasy" },
    update: {},
    create: {
      slug: "fantasy",
      translations: {
        create: {
          language: "pl",
          name: "Fantasy",
          name_search: "fantasy",
        },
      },
    },
  });

  // 2. Author
  const author = await prisma.person.upsert({
    where: { slug: "test-author" },
    update: {},
    create: {
      name: "Test Author",
      slug: "test-author",
      name_search: "test author",
    },
  });

  // 3. Book
  const book = await prisma.book.upsert({
    where: { slug: "test-book" },
    update: {},
    create: {
      slug: "test-book",
      title: "Test Book",
      title_search: "test book",

      authors: {
        create: {
          personId: author.id,
          order: 1,
        },
      },

      genres: {
        create: {
          genreId: genre.id,
        },
      },
    },
  });

  // 4. Edition
  const edition = await prisma.edition.upsert({
    where: { isbn13: "9780000000001" },
    update: {},
    create: {
      bookId: book.id,
      isbn13: "9780000000001",
      language: "pl",
      title: "Test Book Edition",
      title_search: "test book edition",
      pageCount: 123,
      format: "PAPERBACK",
      description: "Test edition for E2E tests",
    },
  });

  console.log("Created:");
  console.log({
    bookId: book.id,
    editionId: edition.id,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
