/*
  Warnings:

  - You are about to drop the column `phone` on the `tbcompanies` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbcompanies" (
    "PK_company" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taxId" TEXT,
    "country" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tbcompanies" ("PK_company", "country", "createdAt", "name", "slug", "taxId") SELECT "PK_company", "country", "createdAt", "name", "slug", "taxId" FROM "tbcompanies";
DROP TABLE "tbcompanies";
ALTER TABLE "new_tbcompanies" RENAME TO "tbcompanies";
CREATE UNIQUE INDEX "tbcompanies_slug_key" ON "tbcompanies"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
