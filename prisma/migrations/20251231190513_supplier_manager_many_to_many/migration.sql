/*
  Warnings:

  - You are about to drop the column `FK_manager` on the `tbsuppliers` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "tbsupplier_managers" (
    "PK_supplier_manager" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_supplier" INTEGER NOT NULL,
    "FK_manager" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbsupplier_managers_FK_supplier_fkey" FOREIGN KEY ("FK_supplier") REFERENCES "tbsuppliers" ("PK_supplier") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tbsupplier_managers_FK_manager_fkey" FOREIGN KEY ("FK_manager") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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

-- CreateIndex
CREATE INDEX "tbsupplier_managers_FK_supplier_idx" ON "tbsupplier_managers"("FK_supplier");

-- CreateIndex
CREATE INDEX "tbsupplier_managers_FK_manager_idx" ON "tbsupplier_managers"("FK_manager");

-- CreateIndex
CREATE UNIQUE INDEX "tbsupplier_managers_FK_supplier_FK_manager_key" ON "tbsupplier_managers"("FK_supplier", "FK_manager");
