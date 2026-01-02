/*
  Warnings:

  - You are about to drop the column `createdBy` on the `tbbranches` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `tbbranches` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `tbsuppliers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `tbsuppliers` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbaudit_logs" (
    "PK_log" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "FK_employee" INTEGER,
    "FK_company" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "tbaudit_logs_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbaudit_logs_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbaudit_logs" ("FK_employee", "PK_log", "action", "createdAt", "entity", "entityId", "newValue", "oldValue") SELECT "FK_employee", "PK_log", "action", "createdAt", "entity", "entityId", "newValue", "oldValue" FROM "tbaudit_logs";
DROP TABLE "tbaudit_logs";
ALTER TABLE "new_tbaudit_logs" RENAME TO "tbaudit_logs";
CREATE INDEX "tbaudit_logs_entity_entityId_idx" ON "tbaudit_logs"("entity", "entityId");
CREATE INDEX "tbaudit_logs_FK_employee_idx" ON "tbaudit_logs"("FK_employee");
CREATE INDEX "tbaudit_logs_createdAt_idx" ON "tbaudit_logs"("createdAt");
CREATE TABLE "new_tbbranches" (
    "PK_branch" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER,
    "name" TEXT NOT NULL,
    "isWarehouse" BOOLEAN NOT NULL DEFAULT false,
    "FK_owner" INTEGER,
    "phone" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "department" TEXT,
    "country" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "FK_createdBy" INTEGER,
    "FK_updatedBy" INTEGER,
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_updatedBy_fkey" FOREIGN KEY ("FK_updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbbranches" ("FK_company", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "phone", "updatedAt") SELECT "FK_company", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "phone", "updatedAt" FROM "tbbranches";
DROP TABLE "tbbranches";
ALTER TABLE "new_tbbranches" RENAME TO "tbbranches";
CREATE TABLE "new_tbsuppliers" (
    "PK_supplier" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "supplierNumber" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "city" TEXT,
    "department" TEXT,
    "country" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_tbsuppliers" ("PK_supplier", "address", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt") SELECT "PK_supplier", "address", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt" FROM "tbsuppliers";
DROP TABLE "tbsuppliers";
ALTER TABLE "new_tbsuppliers" RENAME TO "tbsuppliers";
CREATE UNIQUE INDEX "tbsuppliers_supplierNumber_key" ON "tbsuppliers"("supplierNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
