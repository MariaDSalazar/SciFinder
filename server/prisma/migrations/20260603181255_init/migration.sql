-- CreateTable
CREATE TABLE "FavoritePaper" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SearchHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "query" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
