-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "ci" TEXT,
    "notes" TEXT,
    "birthDate" DATETIME,
    "partnerSince" DATETIME,
    "contractEndAt" DATETIME,
    "isIndefinite" BOOLEAN NOT NULL DEFAULT false,
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
INSERT INTO "new_tbsuppliers" ("FK_company", "FK_createdBy", "FK_updatedBy", "PK_supplier", "address", "birthDate", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "partnerSince", "phone", "updatedAt") SELECT "FK_company", "FK_createdBy", "FK_updatedBy", "PK_supplier", "address", "birthDate", "city", "country", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "partnerSince", "phone", "updatedAt" FROM "tbsuppliers";
DROP TABLE "tbsuppliers";
ALTER TABLE "new_tbsuppliers" RENAME TO "tbsuppliers";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
