/*
  Warnings:

  - Added the required column `slug` to the `tbcompanies` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbcompanies" (
    "PK_company" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taxId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_tbcompanies" ("PK_company", "createdAt", "name", "taxId") SELECT "PK_company", "createdAt", "name", "taxId" FROM "tbcompanies";
DROP TABLE "tbcompanies";
ALTER TABLE "new_tbcompanies" RENAME TO "tbcompanies";
CREATE UNIQUE INDEX "tbcompanies_slug_key" ON "tbcompanies"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
