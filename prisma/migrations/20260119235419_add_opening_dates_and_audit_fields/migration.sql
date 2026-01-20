-- AlterTable
ALTER TABLE "tbwarehouses" ADD COLUMN "openedAt" DATETIME;

-- CreateTable
CREATE TABLE "tbcompany_settings_history" (
    "PK_history" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER NOT NULL,
    "FK_changedBy" INTEGER,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldValues" JSONB,
    "newValues" JSONB,
    "reason" TEXT,
    "changeType" TEXT NOT NULL DEFAULT 'UPDATE'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbbranches" (
    "PK_branch" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER,
    "name" TEXT NOT NULL,
    "FK_owner" INTEGER,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "department" TEXT,
    "country" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "openedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "FK_createdBy" INTEGER,
    "FK_updatedBy" INTEGER,
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_updatedBy_fkey" FOREIGN KEY ("FK_updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbbranches" ("FK_company", "FK_createdBy", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "latitude", "longitude", "name", "phone") SELECT "FK_company", "FK_createdBy", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "latitude", "longitude", "name", "phone" FROM "tbbranches";
DROP TABLE "tbbranches";
ALTER TABLE "new_tbbranches" RENAME TO "tbbranches";
CREATE TABLE "new_tbsuppliers" (
    "PK_supplier" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "department" TEXT,
    "country" TEXT,
    "notes" TEXT,
    "birthDate" DATETIME,
    "partnerSince" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "FK_company" INTEGER,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "FK_createdBy" INTEGER,
    "FK_updatedBy" INTEGER,
    CONSTRAINT "tbsuppliers_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbsuppliers_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbsuppliers_FK_updatedBy_fkey" FOREIGN KEY ("FK_updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbsuppliers" ("FK_company", "PK_supplier", "address", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "updatedAt") SELECT "FK_company", "PK_supplier", "address", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "updatedAt" FROM "tbsuppliers";
DROP TABLE "tbsuppliers";
ALTER TABLE "new_tbsuppliers" RENAME TO "tbsuppliers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "tbcompany_settings_history_FK_company_idx" ON "tbcompany_settings_history"("FK_company");

-- CreateIndex
CREATE INDEX "tbcompany_settings_history_changedAt_idx" ON "tbcompany_settings_history"("changedAt");
