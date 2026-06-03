-- AlterTable
ALTER TABLE "FavoritePaper" DROP CONSTRAINT "FavoritePaper_pkey",
DROP COLUMN "id",
ADD COLUMN     "paperId" TEXT NOT NULL,
ADD COLUMN     "recordId" SERIAL NOT NULL,
ADD COLUMN     "sessionId" TEXT NOT NULL,
ADD CONSTRAINT "FavoritePaper_pkey" PRIMARY KEY ("recordId");

-- AlterTable
ALTER TABLE "SearchHistory" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FavoritePaper_sessionId_paperId_key" ON "FavoritePaper"("sessionId", "paperId");

