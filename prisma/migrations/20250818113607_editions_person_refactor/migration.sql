/*
  Warnings:

  - You are about to drop the column `author` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `imagePublicId` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `pageCount` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `publicationYear` on the `Book` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaFormat" AS ENUM ('HARDCOVER', 'PAPERBACK', 'EBOOK', 'AUDIOBOOK');

-- CreateEnum
CREATE TYPE "EditionContributorRole" AS ENUM ('TRANSLATOR', 'ILLUSTRATOR', 'EDITOR', 'NARRATOR', 'PREFACE_AUTHOR');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author",
DROP COLUMN "imagePublicId",
DROP COLUMN "imageUrl",
DROP COLUMN "pageCount",
DROP COLUMN "publicationYear",
ADD COLUMN     "firstPublicationDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserBook" ADD COLUMN     "editionId" TEXT;

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortName" TEXT,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookAuthor" (
    "bookId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "BookAuthor_pkey" PRIMARY KEY ("bookId","personId")
);

-- CreateTable
CREATE TABLE "Edition" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "isbn13" TEXT,
    "isbn10" TEXT,
    "language" TEXT NOT NULL,
    "publisherId" TEXT,
    "publicationDate" TIMESTAMP(3),
    "pageCount" INTEGER,
    "format" "MediaFormat",
    "coverUrl" TEXT,
    "coverPublicId" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EditionContributor" (
    "editionId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "role" "EditionContributorRole" NOT NULL,
    "order" INTEGER,

    CONSTRAINT "EditionContributor_pkey" PRIMARY KEY ("editionId","personId","role")
);

-- CreateIndex
CREATE INDEX "Person_name_idx" ON "Person"("name");

-- CreateIndex
CREATE INDEX "Person_sortName_idx" ON "Person"("sortName");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_name_key" ON "Publisher"("name");

-- CreateIndex
CREATE INDEX "BookAuthor_personId_idx" ON "BookAuthor"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Edition_isbn13_key" ON "Edition"("isbn13");

-- CreateIndex
CREATE UNIQUE INDEX "Edition_isbn10_key" ON "Edition"("isbn10");

-- CreateIndex
CREATE INDEX "Edition_bookId_idx" ON "Edition"("bookId");

-- CreateIndex
CREATE INDEX "Edition_language_idx" ON "Edition"("language");

-- CreateIndex
CREATE INDEX "Edition_publicationDate_idx" ON "Edition"("publicationDate");

-- CreateIndex
CREATE INDEX "Edition_bookId_language_publicationDate_idx" ON "Edition"("bookId", "language", "publicationDate");

-- CreateIndex
CREATE INDEX "EditionContributor_personId_idx" ON "EditionContributor"("personId");

-- CreateIndex
CREATE INDEX "UserBook_editionId_idx" ON "UserBook"("editionId");

-- CreateIndex
CREATE INDEX "UserBook_userId_addedAt_idx" ON "UserBook"("userId", "addedAt");

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookAuthor" ADD CONSTRAINT "BookAuthor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edition" ADD CONSTRAINT "Edition_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edition" ADD CONSTRAINT "Edition_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditionContributor" ADD CONSTRAINT "EditionContributor_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditionContributor" ADD CONSTRAINT "EditionContributor_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
