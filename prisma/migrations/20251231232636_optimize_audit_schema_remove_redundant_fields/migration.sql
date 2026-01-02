/*
  Warnings:

  - You are about to drop the column `FK_updatedBy` on the `tbbranches` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tbbranches` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tbprivileges` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbauth" (
    "PK_auth" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER,
    "FK_privilege" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" DATETIME,
    "accountType" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbauth_FK_privilege_fkey" FOREIGN KEY ("FK_privilege") REFERENCES "tbprivileges" ("PK_privilege") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbauth_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbauth_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbauth" ("FK_company", "FK_privilege", "PK_auth", "accountType", "createdAt", "isActive", "lastLogin", "password", "username") SELECT "FK_company", "FK_privilege", "PK_auth", "accountType", "createdAt", "isActive", "lastLogin", "password", "username" FROM "tbauth";
DROP TABLE "tbauth";
ALTER TABLE "new_tbauth" RENAME TO "tbauth";
CREATE UNIQUE INDEX "tbauth_username_key" ON "tbauth"("username");
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
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbbranches" ("FK_company", "FK_createdBy", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "phone") SELECT "FK_company", "FK_createdBy", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "phone" FROM "tbbranches";
DROP TABLE "tbbranches";
ALTER TABLE "new_tbbranches" RENAME TO "tbbranches";
CREATE TABLE "new_tbcompanies" (
    "PK_company" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taxId" TEXT,
    "country" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbcompanies_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbcompanies" ("PK_company", "country", "createdAt", "name", "slug", "taxId") SELECT "PK_company", "country", "createdAt", "name", "slug", "taxId" FROM "tbcompanies";
DROP TABLE "tbcompanies";
ALTER TABLE "new_tbcompanies" RENAME TO "tbcompanies";
CREATE UNIQUE INDEX "tbcompanies_slug_key" ON "tbcompanies"("slug");
CREATE TABLE "new_tbemployee_profiles" (
    "PK_employee" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_auth" INTEGER NOT NULL,
    "FK_branch" INTEGER,
    "FK_company" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "phone" TEXT,
    "birthDate" DATETIME,
    "salary" DECIMAL NOT NULL DEFAULT 0,
    "hireDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contractType" TEXT NOT NULL DEFAULT 'INDEFINIDO',
    "homeAddress" TEXT,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbemployee_profiles_FK_auth_fkey" FOREIGN KEY ("FK_auth") REFERENCES "tbauth" ("PK_auth") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbemployee_profiles" ("FK_auth", "FK_branch", "FK_company", "PK_employee", "birthDate", "ci", "contractType", "deletedAt", "firstName", "hireDate", "homeAddress", "lastName", "phone", "salary") SELECT "FK_auth", "FK_branch", "FK_company", "PK_employee", "birthDate", "ci", "contractType", "deletedAt", "firstName", "hireDate", "homeAddress", "lastName", "phone", "salary" FROM "tbemployee_profiles";
DROP TABLE "tbemployee_profiles";
ALTER TABLE "new_tbemployee_profiles" RENAME TO "tbemployee_profiles";
CREATE UNIQUE INDEX "tbemployee_profiles_FK_auth_key" ON "tbemployee_profiles"("FK_auth");
CREATE UNIQUE INDEX "tbemployee_profiles_ci_key" ON "tbemployee_profiles"("ci");
CREATE TABLE "new_tbprivileges" (
    "PK_privilege" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "privilegeName" TEXT NOT NULL,
    "privilegeCode" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbprivileges_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbprivileges" ("PK_privilege", "createdAt", "description", "privilegeCode", "privilegeName") SELECT "PK_privilege", "createdAt", "description", "privilegeCode", "privilegeName" FROM "tbprivileges";
DROP TABLE "tbprivileges";
ALTER TABLE "new_tbprivileges" RENAME TO "tbprivileges";
CREATE UNIQUE INDEX "tbprivileges_privilegeName_key" ON "tbprivileges"("privilegeName");
CREATE UNIQUE INDEX "tbprivileges_privilegeCode_key" ON "tbprivileges"("privilegeCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
