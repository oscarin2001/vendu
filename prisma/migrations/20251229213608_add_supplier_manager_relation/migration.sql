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
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "FK_manager" INTEGER,
    CONSTRAINT "tbsuppliers_FK_manager_fkey" FOREIGN KEY ("FK_manager") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbsuppliers" ("PK_supplier", "address", "city", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt") SELECT "PK_supplier", "address", "city", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt" FROM "tbsuppliers";
DROP TABLE "tbsuppliers";
ALTER TABLE "new_tbsuppliers" RENAME TO "tbsuppliers";
CREATE UNIQUE INDEX "tbsuppliers_supplierNumber_key" ON "tbsuppliers"("supplierNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
