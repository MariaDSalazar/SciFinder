-- CreateTable
CREATE TABLE "FavoritePaper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "venue" TEXT,
    "year" INTEGER,
    "citations" INTEGER NOT NULL DEFAULT 0,
    "doi" TEXT,
    "pdfUrl" TEXT,
    "landingUrl" TEXT,
    "isOpenAccess" BOOLEAN NOT NULL DEFAULT false,
    "abstract" TEXT,
    "topic" TEXT,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoritePaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchHistory_pkey" PRIMARY KEY ("id")
);
