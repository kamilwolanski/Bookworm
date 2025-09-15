-- Extensions (potrzebne do CITEXT i slugowania po name)
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 1) updatedAt: dodaj z DEFAULT (wypełni istniejące), potem zdejmij DEFAULT
ALTER TABLE "Book"    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();
ALTER TABLE "User"    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT now();

-- (opcjonalnie) usuwamy domyślne 0 na ratingach, jeśli jeszcze były
ALTER TABLE "Book" ALTER COLUMN "averageRating" DROP DEFAULT;
ALTER TABLE "Book" ALTER COLUMN "ratingCount" DROP DEFAULT;

-- 2) Genre.slug: enum -> text bez utraty danych (zamiast DROP/ADD)
ALTER TABLE "Genre" ALTER COLUMN "slug" TYPE TEXT USING "slug"::text;

-- 3) Person.slug: dodaj jako NULL, backfill z name, deduplikuj, ustaw NOT NULL
ALTER TABLE "Person" ADD COLUMN IF NOT EXISTS "slug" TEXT;

UPDATE "Person"
SET slug = LOWER(REGEXP_REPLACE(unaccent(name), '[^a-z0-9]+', '-', 'g'))
WHERE (slug IS NULL OR slug = '') AND name IS NOT NULL;

WITH d AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) rn
  FROM "Person"
  WHERE slug IS NOT NULL AND slug <> ''
)
UPDATE "Person" p
SET slug = d.slug || '-' || (d.rn - 1)
FROM d
WHERE p.id = d.id AND d.rn > 1;

ALTER TABLE "Person" ALTER COLUMN "slug" SET NOT NULL;

-- 4) Publisher.slug: analogicznie
ALTER TABLE "Publisher" ADD COLUMN IF NOT EXISTS "slug" TEXT;

UPDATE "Publisher"
SET slug = LOWER(REGEXP_REPLACE(unaccent(name), '[^a-z0-9]+', '-', 'g'))
WHERE (slug IS NULL OR slug = '') AND name IS NOT NULL;

WITH d AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) rn
  FROM "Publisher"
  WHERE slug IS NOT NULL AND slug <> ''
)
UPDATE "Publisher" p
SET slug = d.slug || '-' || (d.rn - 1)
FROM d
WHERE p.id = d.id AND d.rn > 1;

ALTER TABLE "Publisher" ALTER COLUMN "slug" SET NOT NULL;

-- 5) Sprzątanie po starym enumie (tylko jeśli jeszcze istnieje)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GenreSlug') THEN
    DROP TYPE "GenreSlug";
  END IF;
END $$;

-- 6) Email → CITEXT (upewnij się wcześniej, że nie masz duplikatów lower(email))
ALTER TABLE "User" ALTER COLUMN "email" TYPE CITEXT;

-- 7) Zdejmij DEFAULT z updatedAt, żeby Prisma @updatedAt przejęło sterowanie
ALTER TABLE "Book"    ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Comment" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "User"    ALTER COLUMN "updatedAt" DROP DEFAULT;

-- 8) Indeksy i uniki (po backfillu)
CREATE INDEX IF NOT EXISTS "Book_addedAt_idx" ON "Book"("addedAt");
CREATE INDEX IF NOT EXISTS "Book_title_idx" ON "Book"("title");
CREATE INDEX IF NOT EXISTS "BookAuthor_bookId_order_idx" ON "BookAuthor"("bookId", "order");
CREATE INDEX IF NOT EXISTS "BookGenre_genreId_idx" ON "BookGenre"("genreId");
CREATE INDEX IF NOT EXISTS "Comment_bookId_addedAt_idx" ON "Comment"("bookId", "addedAt");
CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");
CREATE INDEX IF NOT EXISTS "CommentRating_userId_idx" ON "CommentRating"("userId");
CREATE INDEX IF NOT EXISTS "EditionContributor_editionId_order_idx" ON "EditionContributor"("editionId", "order");
CREATE INDEX IF NOT EXISTS "Publisher_name_idx" ON "Publisher"("name");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Genre_slug_key') THEN
    CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Person_slug_key') THEN
    CREATE UNIQUE INDEX "Person_slug_key" ON "Person"("slug");
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'Publisher_slug_key') THEN
    CREATE UNIQUE INDEX "Publisher_slug_key" ON "Publisher"("slug");
  END IF;
END $$;
