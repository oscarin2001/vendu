/*
  Warnings:

  - You are about to drop the column `isWarehouse` on the `tbbranches` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "tbwarehouses" (
    "PK_warehouse" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER,
    "name" TEXT NOT NULL,
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
    CONSTRAINT "tbwarehouses_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouses_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouses_FK_updatedBy_fkey" FOREIGN KEY ("FK_updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbmanager_warehouses" (
    "PK_manager_warehouse" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_employee" INTEGER NOT NULL,
    "FK_warehouse" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_assignedBy" INTEGER,
    CONSTRAINT "tbmanager_warehouses_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbmanager_warehouses_FK_warehouse_fkey" FOREIGN KEY ("FK_warehouse") REFERENCES "tbwarehouses" ("PK_warehouse") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbmanager_warehouses_FK_assignedBy_fkey" FOREIGN KEY ("FK_assignedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbwarehouse_branches" (
    "PK_warehouse_branch" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_warehouse" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_assignedBy" INTEGER,
    CONSTRAINT "tbwarehouse_branches_FK_warehouse_fkey" FOREIGN KEY ("FK_warehouse") REFERENCES "tbwarehouses" ("PK_warehouse") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouse_branches_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouse_branches_FK_assignedBy_fkey" FOREIGN KEY ("FK_assignedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbbranches" ("FK_company", "FK_createdBy", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "latitude", "longitude", "name", "phone") SELECT "FK_company", "FK_createdBy", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "latitude", "longitude", "name", "phone" FROM "tbbranches";
DROP TABLE "tbbranches";
ALTER TABLE "new_tbbranches" RENAME TO "tbbranches";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "tbmanager_warehouses_FK_employee_FK_warehouse_key" ON "tbmanager_warehouses"("FK_employee", "FK_warehouse");

-- CreateIndex
CREATE UNIQUE INDEX "tbwarehouse_branches_FK_warehouse_FK_branch_key" ON "tbwarehouse_branches"("FK_warehouse", "FK_branch");
