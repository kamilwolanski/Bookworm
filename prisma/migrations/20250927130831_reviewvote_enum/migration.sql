/*
  Warnings:

  - You are about to drop the column `value` on the `ReviewVote` table. All the data in the column will be lost.
  - Added the required column `type` to the `ReviewVote` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReviewVoteType" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "ReviewVote" DROP COLUMN "value",
ADD COLUMN     "type" "ReviewVoteType" NOT NULL;
