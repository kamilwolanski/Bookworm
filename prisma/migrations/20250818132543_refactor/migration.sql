-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "deathDate" TIMESTAMP(3),
ADD COLUMN     "imageCredit" TEXT,
ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageSourceUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "nationality" TEXT;

-- CreateIndex
CREATE INDEX "UserBook_userId_readingStatus_addedAt_idx" ON "UserBook"("userId", "readingStatus", "addedAt");
