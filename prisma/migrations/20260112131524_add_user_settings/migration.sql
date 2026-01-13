/*
  Warnings:

  - You are about to drop the column `language` on the `tbauth` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `tbauth` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `tbauth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tbemployee_profiles" ADD COLUMN "language" TEXT DEFAULT 'es';
ALTER TABLE "tbemployee_profiles" ADD COLUMN "notifications" BOOLEAN DEFAULT true;
ALTER TABLE "tbemployee_profiles" ADD COLUMN "theme" TEXT DEFAULT 'SYSTEM';

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
INSERT INTO "new_tbauth" ("FK_company", "FK_createdBy", "FK_privilege", "PK_auth", "accountType", "createdAt", "isActive", "lastLogin", "password", "username") SELECT "FK_company", "FK_createdBy", "FK_privilege", "PK_auth", "accountType", "createdAt", "isActive", "lastLogin", "password", "username" FROM "tbauth";
DROP TABLE "tbauth";
ALTER TABLE "new_tbauth" RENAME TO "tbauth";
CREATE UNIQUE INDEX "tbauth_username_key" ON "tbauth"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
