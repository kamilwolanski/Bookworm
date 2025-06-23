/*
  Warnings:

  - Changed the type of `slug` on the `Genre` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GenreSlug" AS ENUM ('FANTASY', 'SCIENCE_FICTION', 'THRILLER', 'ROMANCE', 'NON_FICTION', 'HORROR', 'MYSTERY', 'HISTORY', 'BIOGRAPHY', 'POETRY', 'DRAMA', 'ADVENTURE', 'CLASSICS', 'CHILDREN', 'YOUNG_ADULT', 'SELF_HELP', 'HEALTH', 'TECHNOLOGY', 'PHILOSOPHY', 'RELIGION', 'ART', 'TRAVEL', 'SATIRE', 'GOTHIC', 'DYSTOPIA', 'MEMOIR', 'CRIME', 'DETECTIVE', 'ESSAY', 'HUMOR', 'COOKING', 'BUSINESS', 'EDUCATION', 'PSYCHOLOGY', 'POLITICS', 'SPORT', 'TRUE_CRIME', 'FAIRY_TALES', 'WESTERN', 'LGBTQ', 'CULTURE', 'COMICS', 'GRAPHIC_NOVEL', 'ESSAYS', 'LITERARY_FICTION', 'SPIRITUALITY', 'ENVIRONMENT', 'MUSIC', 'CLASSIC_FICTION', 'CONTEMPORARY_FICTION');

-- AlterTable
ALTER TABLE "Genre" DROP COLUMN "slug",
ADD COLUMN     "slug" "GenreSlug" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_slug_key" ON "Genre"("slug");
