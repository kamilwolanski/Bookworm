/*
  Warnings:

  - You are about to drop the column `description` on the `Book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Edition" ADD COLUMN     "description" TEXT;
