-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
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
    "updatedAt" DATETIME,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    CONSTRAINT "tbsuppliers_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbsuppliers_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbsuppliers" ("PK_supplier", "address", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt") SELECT "PK_supplier", "address", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt" FROM "tbsuppliers";
DROP TABLE "tbsuppliers";
ALTER TABLE "new_tbsuppliers" RENAME TO "tbsuppliers";
CREATE UNIQUE INDEX "tbsuppliers_supplierNumber_key" ON "tbsuppliers"("supplierNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
