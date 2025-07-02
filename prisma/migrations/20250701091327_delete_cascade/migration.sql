-- DropForeignKey
ALTER TABLE "BookGenre" DROP CONSTRAINT "BookGenre_bookId_fkey";

-- AddForeignKey
ALTER TABLE "BookGenre" ADD CONSTRAINT "BookGenre_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
