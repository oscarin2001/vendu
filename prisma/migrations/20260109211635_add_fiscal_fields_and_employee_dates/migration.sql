-- AlterTable
ALTER TABLE "tbemployee_profiles" ADD COLUMN "birthYear" INTEGER;
ALTER TABLE "tbemployee_profiles" ADD COLUMN "contractEndAt" DATETIME;
ALTER TABLE "tbemployee_profiles" ADD COLUMN "joinedAt" DATETIME;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbcompanies" (
    "PK_company" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taxId" TEXT,
    "businessName" TEXT,
    "fiscalAddress" TEXT,
    "country" TEXT,
    "department" TEXT,
    "commerceType" TEXT,
    "description" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "openedAt" DATETIME,
    "tosRead" BOOLEAN NOT NULL DEFAULT false,
    "tosReadAt" DATETIME,
    "tosAccepted" BOOLEAN NOT NULL DEFAULT false,
    "tosAcceptedAt" DATETIME,
    "tosAcceptedIp" TEXT,
    "tosAcceptedUa" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbcompanies_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbcompanies" ("FK_createdBy", "PK_company", "country", "createdAt", "name", "slug", "taxId") SELECT "FK_createdBy", "PK_company", "country", "createdAt", "name", "slug", "taxId" FROM "tbcompanies";
DROP TABLE "tbcompanies";
ALTER TABLE "new_tbcompanies" RENAME TO "tbcompanies";
CREATE UNIQUE INDEX "tbcompanies_slug_key" ON "tbcompanies"("slug");
CREATE UNIQUE INDEX "tbcompanies_name_key" ON "tbcompanies"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
