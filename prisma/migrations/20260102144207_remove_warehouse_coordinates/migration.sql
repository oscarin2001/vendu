/*
  Warnings:

  - You are about to drop the column `latitude` on the `tbwarehouses` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `tbwarehouses` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbwarehouses" (
    "PK_warehouse" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "department" TEXT,
    "country" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "FK_createdBy" INTEGER,
    "FK_updatedBy" INTEGER,
    CONSTRAINT "tbwarehouses_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouses_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouses_FK_updatedBy_fkey" FOREIGN KEY ("FK_updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbwarehouses" ("FK_company", "FK_createdBy", "FK_updatedBy", "PK_warehouse", "address", "city", "country", "createdAt", "department", "name", "phone", "updatedAt") SELECT "FK_company", "FK_createdBy", "FK_updatedBy", "PK_warehouse", "address", "city", "country", "createdAt", "department", "name", "phone", "updatedAt" FROM "tbwarehouses";
DROP TABLE "tbwarehouses";
ALTER TABLE "new_tbwarehouses" RENAME TO "tbwarehouses";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
