/*
  Warnings:

  - You are about to drop the column `rating` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `readingStatus` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Book` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "UserBook" (
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "readingStatus" "ReadingStatus" NOT NULL DEFAULT 'WANT_TO_READ',
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "rating" SMALLINT,

    CONSTRAINT "UserBook_pkey" PRIMARY KEY ("bookId","userId")
);

-- 🔁 Przeniesienie danych z Book do UserBook
INSERT INTO "UserBook" ("userId", "bookId", "readingStatus", "rating", "note", "addedAt")
SELECT "userId", "id", "readingStatus", "rating", '', CURRENT_TIMESTAMP
FROM "Book"
WHERE "userId" IS NOT NULL;

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_userId_fkey";

-- AlterTable
ALTER TABLE "Book"
  DROP COLUMN "rating",
  DROP COLUMN "readingStatus",
  DROP COLUMN "userId",
  ADD COLUMN "averageRating" DOUBLE PRECISION DEFAULT 0,
  ADD COLUMN "ratingCount" INTEGER DEFAULT 0;

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_bookId_fkey"
FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
