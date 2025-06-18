-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('WANT_TO_READ', 'READING', 'READ', 'ABANDONED');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "genres" TEXT[],
ADD COLUMN     "pageCount" INTEGER,
ADD COLUMN     "rating" SMALLINT,
ADD COLUMN     "readingStatus" "ReadingStatus" NOT NULL DEFAULT 'WANT_TO_READ';
