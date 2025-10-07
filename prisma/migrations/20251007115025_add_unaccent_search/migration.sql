-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "title_search" TEXT;

-- AlterTable
ALTER TABLE "Edition" ADD COLUMN     "subtitle_search" TEXT,
ADD COLUMN     "title_search" TEXT;

-- AlterTable
ALTER TABLE "GenreTranslation" ADD COLUMN     "name_search" TEXT;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "aliasesSearch" TEXT[],
ADD COLUMN     "name_search" TEXT,
ADD COLUMN     "sortName_search" TEXT;

-- CreateIndex
CREATE INDEX "Book_title_search_idx" ON "Book"("title_search");

-- CreateIndex
CREATE INDEX "Edition_title_search_idx" ON "Edition"("title_search");

-- CreateIndex
CREATE INDEX "Edition_subtitle_search_idx" ON "Edition"("subtitle_search");

-- CreateIndex
CREATE INDEX "GenreTranslation_name_search_idx" ON "GenreTranslation"("name_search");

-- CreateIndex
CREATE INDEX "Person_name_search_idx" ON "Person"("name_search");

-- CreateIndex
CREATE INDEX "Person_sortName_search_idx" ON "Person"("sortName_search");
