-- CreateIndex
CREATE INDEX "Edition_bookId_language_title_idx" ON "Edition"("bookId", "language", "title");

-- CreateIndex
CREATE INDEX "Edition_bookId_language_subtitle_idx" ON "Edition"("bookId", "language", "subtitle");
