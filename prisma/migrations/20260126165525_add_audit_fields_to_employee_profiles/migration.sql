-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "birthYear" INTEGER,
    "salary" DECIMAL NOT NULL DEFAULT 0,
    "hireDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" DATETIME,
    "contractEndAt" DATETIME,
    "contractType" TEXT NOT NULL DEFAULT 'INDEFINIDO',
    "contributionType" TEXT NOT NULL DEFAULT 'NONE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "homeAddress" TEXT,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "FK_createdBy" INTEGER,
    "FK_updatedBy" INTEGER,
    "theme" TEXT DEFAULT 'SYSTEM',
    "notifications" BOOLEAN DEFAULT true,
    "language" TEXT DEFAULT 'es',
    CONSTRAINT "tbemployee_profiles_FK_auth_fkey" FOREIGN KEY ("FK_auth") REFERENCES "tbauth" ("PK_auth") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_updatedBy_fkey" FOREIGN KEY ("FK_updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbemployee_profiles" ("FK_auth", "FK_branch", "FK_company", "FK_createdBy", "PK_employee", "birthDate", "birthYear", "ci", "contractEndAt", "contractType", "contributionType", "createdAt", "deletedAt", "firstName", "hireDate", "homeAddress", "joinedAt", "language", "lastName", "notifications", "phone", "salary", "status", "theme") SELECT "FK_auth", "FK_branch", "FK_company", "FK_createdBy", "PK_employee", "birthDate", "birthYear", "ci", "contractEndAt", "contractType", "contributionType", "createdAt", "deletedAt", "firstName", "hireDate", "homeAddress", "joinedAt", "language", "lastName", "notifications", "phone", "salary", "status", "theme" FROM "tbemployee_profiles";
DROP TABLE "tbemployee_profiles";
ALTER TABLE "new_tbemployee_profiles" RENAME TO "tbemployee_profiles";
CREATE UNIQUE INDEX "tbemployee_profiles_FK_auth_key" ON "tbemployee_profiles"("FK_auth");
CREATE UNIQUE INDEX "tbemployee_profiles_ci_key" ON "tbemployee_profiles"("ci");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
