/*
  Warnings:

  - You are about to drop the column `openingHours` on the `tbbranches` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbcash_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `devices` on the `tbdevices` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "tbbranch_hours" (
    "PK_branch_hour" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_branch" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "opening_time" TEXT,
    "closing_time" TEXT,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbbranch_hours_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbcash_session_actions" (
    "PK_action" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_session" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "amount" DECIMAL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbcash_session_actions_FK_session_fkey" FOREIGN KEY ("FK_session") REFERENCES "tbcash_sessions" ("PK_session") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbdevice_details" (
    "PK_device_detail" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_device" INTEGER NOT NULL,
    "device_type" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "last_seen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbdevice_details_FK_device_fkey" FOREIGN KEY ("FK_device") REFERENCES "tbdevices" ("PK_device") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbbranches" ("FK_company", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "phone", "updatedAt") SELECT "FK_company", "FK_owner", "PK_branch", "address", "city", "country", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "phone", "updatedAt" FROM "tbbranches";
DROP TABLE "tbbranches";
ALTER TABLE "new_tbbranches" RENAME TO "tbbranches";
CREATE TABLE "new_tbcash_sessions" (
    "PK_session" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_branch" INTEGER NOT NULL,
    "FK_employee" INTEGER NOT NULL,
    "openingAmount" DECIMAL NOT NULL DEFAULT 0,
    "expectedAmount" DECIMAL NOT NULL DEFAULT 0,
    "realAmount" DECIMAL,
    "totalCash" DECIMAL NOT NULL DEFAULT 0,
    "totalQr" DECIMAL NOT NULL DEFAULT 0,
    "totalTransfer" DECIMAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "openedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" DATETIME,
    "notes" TEXT,
    CONSTRAINT "tbcash_sessions_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbcash_sessions_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbcash_sessions" ("FK_branch", "FK_employee", "PK_session", "closedAt", "expectedAmount", "notes", "openedAt", "openingAmount", "realAmount", "status", "totalCash", "totalQr", "totalTransfer") SELECT "FK_branch", "FK_employee", "PK_session", "closedAt", "expectedAmount", "notes", "openedAt", "openingAmount", "realAmount", "status", "totalCash", "totalQr", "totalTransfer" FROM "tbcash_sessions";
DROP TABLE "tbcash_sessions";
ALTER TABLE "new_tbcash_sessions" RENAME TO "tbcash_sessions";
CREATE UNIQUE INDEX "tbcash_sessions_FK_branch_status_key" ON "tbcash_sessions"("FK_branch", "status");
CREATE TABLE "new_tbdevices" (
    "PK_device" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_auth" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbdevices_FK_auth_fkey" FOREIGN KEY ("FK_auth") REFERENCES "tbauth" ("PK_auth") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbdevices" ("FK_auth", "PK_device", "createdAt", "updatedAt") SELECT "FK_auth", "PK_device", "createdAt", "updatedAt" FROM "tbdevices";
DROP TABLE "tbdevices";
ALTER TABLE "new_tbdevices" RENAME TO "tbdevices";
CREATE UNIQUE INDEX "tbdevices_FK_auth_key" ON "tbdevices"("FK_auth");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "tbbranch_hours_FK_branch_day_of_week_key" ON "tbbranch_hours"("FK_branch", "day_of_week");

-- CreateIndex
CREATE INDEX "tbproducts_FK_brand_FK_season_isActive_idx" ON "tbproducts"("FK_brand", "FK_season", "isActive");

-- CreateIndex
CREATE INDEX "tbproducts_slug_idx" ON "tbproducts"("slug");

-- CreateIndex
CREATE INDEX "tbproductvariants_FK_product_isPublished_isActive_idx" ON "tbproductvariants"("FK_product", "isPublished", "isActive");

-- CreateIndex
CREATE INDEX "tbproductvariants_sku_idx" ON "tbproductvariants"("sku");
