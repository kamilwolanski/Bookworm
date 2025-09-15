/*
  Warnings:

  - You are about to drop the column `publisherId` on the `Edition` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Edition" DROP CONSTRAINT "Edition_publisherId_fkey";

-- AlterTable
ALTER TABLE "Edition" DROP COLUMN "publisherId";

-- CreateTable
CREATE TABLE "EditionPublisher" (
    "editionId" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "order" INTEGER,

    CONSTRAINT "EditionPublisher_pkey" PRIMARY KEY ("editionId","publisherId")
);

-- CreateIndex
CREATE INDEX "EditionPublisher_publisherId_idx" ON "EditionPublisher"("publisherId");

-- CreateIndex
CREATE INDEX "EditionPublisher_editionId_order_idx" ON "EditionPublisher"("editionId", "order");

-- AddForeignKey
ALTER TABLE "EditionPublisher" ADD CONSTRAINT "EditionPublisher_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EditionPublisher" ADD CONSTRAINT "EditionPublisher_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
