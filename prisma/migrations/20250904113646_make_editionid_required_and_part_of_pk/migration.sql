/*
  Warnings:

  - The primary key for the `UserBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `editionId` on table `UserBook` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_editionId_fkey";

-- AlterTable
ALTER TABLE "UserBook" DROP CONSTRAINT "UserBook_pkey",
ALTER COLUMN "editionId" SET NOT NULL,
ADD CONSTRAINT "UserBook_pkey" PRIMARY KEY ("bookId", "userId", "editionId");

-- AddForeignKey
ALTER TABLE "UserBook" ADD CONSTRAINT "UserBook_editionId_fkey" FOREIGN KEY ("editionId") REFERENCES "Edition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
