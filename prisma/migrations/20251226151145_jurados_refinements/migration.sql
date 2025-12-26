/*
  Warnings:

  - You are about to drop the column `actionHistory` on the `tbattendances` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbbranches` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbbranchspecialdays` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbcategories` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbgenders` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbpayments` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbpayrolls` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbprivileges` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbproducts` table. All the data in the column will be lost.
  - You are about to drop the column `reservedQuantity` on the `tbproductvariants` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `tbproductvariants` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbpurchases` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbshipments` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbstockmovements` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbsuppliers` table. All the data in the column will be lost.
  - You are about to drop the column `actionHistory` on the `tbwarehouse_entry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tbcash_sessions" ADD COLUMN "actionHistory" JSONB;

-- CreateTable
CREATE TABLE "tbsubscriptions" (
    "PK_subscription" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER NOT NULL,
    "planType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "nextBillingDate" DATETIME NOT NULL,
    CONSTRAINT "tbsubscriptions_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbcart_items" (
    "PK_cartItem" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_customer" INTEGER NOT NULL,
    "FK_variant" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guestToken" TEXT,
    "expiresAt" DATETIME,
    CONSTRAINT "tbcart_items_FK_customer_fkey" FOREIGN KEY ("FK_customer") REFERENCES "tbcustomer_profiles" ("PK_customer") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbcart_items_FK_variant_fkey" FOREIGN KEY ("FK_variant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbattendances" (
    "PK_attendance" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_employee" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "checkIn" DATETIME NOT NULL,
    "checkOut" DATETIME,
    "device" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tbattendances_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbattendances" ("FK_employee", "PK_attendance", "checkIn", "checkOut", "createdAt", "date", "device", "updatedAt") SELECT "FK_employee", "PK_attendance", "checkIn", "checkOut", "createdAt", "date", "device", "updatedAt" FROM "tbattendances";
DROP TABLE "tbattendances";
ALTER TABLE "new_tbattendances" RENAME TO "tbattendances";
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
    CONSTRAINT "tbauth_FK_privilege_fkey" FOREIGN KEY ("FK_privilege") REFERENCES "tbprivileges" ("PK_privilege") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbauth_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbauth" ("FK_company", "FK_privilege", "PK_auth", "createdAt", "isActive", "lastLogin", "password", "username") SELECT "FK_company", "FK_privilege", "PK_auth", "createdAt", "isActive", "lastLogin", "password", "username" FROM "tbauth";
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
    "latitude" REAL,
    "longitude" REAL,
    "openingHours" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbbranches" ("FK_company", "FK_owner", "PK_branch", "address", "city", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "openingHours", "phone", "updatedAt") SELECT "FK_company", "FK_owner", "PK_branch", "address", "city", "createdAt", "department", "isWarehouse", "latitude", "longitude", "name", "openingHours", "phone", "updatedAt" FROM "tbbranches";
DROP TABLE "tbbranches";
ALTER TABLE "new_tbbranches" RENAME TO "tbbranches";
CREATE TABLE "new_tbbranchspecialdays" (
    "PK_specialday" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_branch" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "isClosed" BOOLEAN NOT NULL DEFAULT false,
    "openingTime" TEXT,
    "closingTime" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbbranchspecialdays_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbbranchspecialdays" ("FK_branch", "PK_specialday", "closingTime", "createdAt", "date", "isClosed", "notes", "openingTime", "updatedAt") SELECT "FK_branch", "PK_specialday", "closingTime", "createdAt", "date", "isClosed", "notes", "openingTime", "updatedAt" FROM "tbbranchspecialdays";
DROP TABLE "tbbranchspecialdays";
ALTER TABLE "new_tbbranchspecialdays" RENAME TO "tbbranchspecialdays";
CREATE TABLE "new_tbcategories" (
    "PK_category" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_gender" INTEGER NOT NULL,
    "FK_parent" INTEGER,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbcategories_FK_gender_fkey" FOREIGN KEY ("FK_gender") REFERENCES "tbgenders" ("PK_gender") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbcategories_FK_parent_fkey" FOREIGN KEY ("FK_parent") REFERENCES "tbcategories" ("PK_category") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbcategories" ("FK_gender", "FK_parent", "PK_category", "category", "createdAt", "description", "slug", "updatedAt") SELECT "FK_gender", "FK_parent", "PK_category", "category", "createdAt", "description", "slug", "updatedAt" FROM "tbcategories";
DROP TABLE "tbcategories";
ALTER TABLE "new_tbcategories" RENAME TO "tbcategories";
CREATE UNIQUE INDEX "tbcategories_slug_key" ON "tbcategories"("slug");
CREATE TABLE "new_tbcustomer_profiles" (
    "PK_customer" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_auth" INTEGER,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "city" TEXT,
    "department" TEXT,
    "homeAddress" TEXT,
    "googleMaps" TEXT,
    "customerLevel" TEXT NOT NULL DEFAULT 'NUEVO',
    "totalSpent" DECIMAL NOT NULL DEFAULT 0,
    "ordersCount" INTEGER NOT NULL DEFAULT 0,
    "deletedAt" DATETIME,
    "isGuest" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "tbcustomer_profiles_FK_auth_fkey" FOREIGN KEY ("FK_auth") REFERENCES "tbauth" ("PK_auth") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbcustomer_profiles" ("FK_auth", "PK_customer", "city", "customerLevel", "deletedAt", "department", "email", "firstName", "googleMaps", "homeAddress", "lastName", "ordersCount", "phone", "totalSpent") SELECT "FK_auth", "PK_customer", "city", "customerLevel", "deletedAt", "department", "email", "firstName", "googleMaps", "homeAddress", "lastName", "ordersCount", "phone", "totalSpent" FROM "tbcustomer_profiles";
DROP TABLE "tbcustomer_profiles";
ALTER TABLE "new_tbcustomer_profiles" RENAME TO "tbcustomer_profiles";
CREATE UNIQUE INDEX "tbcustomer_profiles_FK_auth_key" ON "tbcustomer_profiles"("FK_auth");
CREATE UNIQUE INDEX "tbcustomer_profiles_phone_key" ON "tbcustomer_profiles"("phone");
CREATE UNIQUE INDEX "tbcustomer_profiles_email_key" ON "tbcustomer_profiles"("email");
CREATE TABLE "new_tbgenders" (
    "PK_gender" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gender" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_tbgenders" ("PK_gender", "createdAt", "gender", "updatedAt") SELECT "PK_gender", "createdAt", "gender", "updatedAt" FROM "tbgenders";
DROP TABLE "tbgenders";
ALTER TABLE "new_tbgenders" RENAME TO "tbgenders";
CREATE UNIQUE INDEX "tbgenders_gender_key" ON "tbgenders"("gender");
CREATE TABLE "new_tbpayments" (
    "PK_payment" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_order" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbpayments_FK_order_fkey" FOREIGN KEY ("FK_order") REFERENCES "tborders" ("PK_order") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbpayments" ("FK_order", "PK_payment", "amount", "createdAt", "paymentDate", "paymentMethod", "status", "transactionId", "updatedAt") SELECT "FK_order", "PK_payment", "amount", "createdAt", "paymentDate", "paymentMethod", "status", "transactionId", "updatedAt" FROM "tbpayments";
DROP TABLE "tbpayments";
ALTER TABLE "new_tbpayments" RENAME TO "tbpayments";
CREATE UNIQUE INDEX "tbpayments_transactionId_key" ON "tbpayments"("transactionId");
CREATE TABLE "new_tbpayrolls" (
    "PK_payroll" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_employee" INTEGER NOT NULL,
    "periodStart" DATETIME NOT NULL,
    "periodEnd" DATETIME NOT NULL,
    "baseSalary" DECIMAL NOT NULL,
    "bonuses" DECIMAL,
    "deductions" DECIMAL,
    "netSalary" DECIMAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbpayrolls_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbpayrolls" ("FK_employee", "PK_payroll", "baseSalary", "bonuses", "createdAt", "deductions", "netSalary", "paymentDate", "periodEnd", "periodStart", "status", "updatedAt") SELECT "FK_employee", "PK_payroll", "baseSalary", "bonuses", "createdAt", "deductions", "netSalary", "paymentDate", "periodEnd", "periodStart", "status", "updatedAt" FROM "tbpayrolls";
DROP TABLE "tbpayrolls";
ALTER TABLE "new_tbpayrolls" RENAME TO "tbpayrolls";
CREATE TABLE "new_tbprivileges" (
    "PK_privilege" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "privilegeName" TEXT NOT NULL,
    "privilegeCode" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_tbprivileges" ("PK_privilege", "createdAt", "description", "privilegeCode", "privilegeName", "updatedAt") SELECT "PK_privilege", "createdAt", "description", "privilegeCode", "privilegeName", "updatedAt" FROM "tbprivileges";
DROP TABLE "tbprivileges";
ALTER TABLE "new_tbprivileges" RENAME TO "tbprivileges";
CREATE UNIQUE INDEX "tbprivileges_privilegeName_key" ON "tbprivileges"("privilegeName");
CREATE UNIQUE INDEX "tbprivileges_privilegeCode_key" ON "tbprivileges"("privilegeCode");
CREATE TABLE "new_tbproducts" (
    "PK_product" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_brand" INTEGER,
    "FK_season" INTEGER,
    "FK_company" INTEGER,
    "FK_gender" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "fabricType" TEXT,
    "composition" TEXT,
    "careNotes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbproducts_FK_brand_fkey" FOREIGN KEY ("FK_brand") REFERENCES "tbbrands" ("PK_brand") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbproducts_FK_season_fkey" FOREIGN KEY ("FK_season") REFERENCES "tbseasons" ("PK_season") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbproducts_FK_gender_fkey" FOREIGN KEY ("FK_gender") REFERENCES "tbgenders" ("PK_gender") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbproducts_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbproducts" ("FK_brand", "FK_company", "FK_gender", "FK_season", "PK_product", "careNotes", "composition", "createdAt", "deletedAt", "description", "fabricType", "isActive", "name", "sku", "slug", "updatedAt") SELECT "FK_brand", "FK_company", "FK_gender", "FK_season", "PK_product", "careNotes", "composition", "createdAt", "deletedAt", "description", "fabricType", "isActive", "name", "sku", "slug", "updatedAt" FROM "tbproducts";
DROP TABLE "tbproducts";
ALTER TABLE "new_tbproducts" RENAME TO "tbproducts";
CREATE UNIQUE INDEX "tbproducts_sku_key" ON "tbproducts"("sku");
CREATE UNIQUE INDEX "tbproducts_slug_key" ON "tbproducts"("slug");
CREATE TABLE "new_tbproductvariants" (
    "PK_variant" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_product" INTEGER NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DECIMAL,
    "imageUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "discountPrice" DECIMAL,
    "publishDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbproductvariants_FK_product_fkey" FOREIGN KEY ("FK_product") REFERENCES "tbproducts" ("PK_product") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbproductvariants" ("FK_product", "PK_variant", "createdAt", "deletedAt", "imageUrl", "isActive", "isPublished", "price", "publishDate", "sku", "updatedAt") SELECT "FK_product", "PK_variant", "createdAt", "deletedAt", "imageUrl", "isActive", "isPublished", "price", "publishDate", "sku", "updatedAt" FROM "tbproductvariants";
DROP TABLE "tbproductvariants";
ALTER TABLE "new_tbproductvariants" RENAME TO "tbproductvariants";
CREATE UNIQUE INDEX "tbproductvariants_sku_key" ON "tbproductvariants"("sku");
CREATE INDEX "tbproductvariants_isPublished_featured_isActive_idx" ON "tbproductvariants"("isPublished", "featured", "isActive");
CREATE TABLE "new_tbpurchases" (
    "PK_purchase" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_supplier" INTEGER NOT NULL,
    "FK_employee" INTEGER NOT NULL,
    "purchaseDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalItems" INTEGER NOT NULL,
    "totalAmount" DECIMAL NOT NULL,
    "amountPaid" DECIMAL NOT NULL DEFAULT 0,
    "amountOwed" DECIMAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbpurchases_FK_supplier_fkey" FOREIGN KEY ("FK_supplier") REFERENCES "tbsuppliers" ("PK_supplier") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbpurchases_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbpurchases" ("FK_employee", "FK_supplier", "PK_purchase", "amountOwed", "amountPaid", "createdAt", "notes", "purchaseDate", "status", "totalAmount", "totalItems", "updatedAt") SELECT "FK_employee", "FK_supplier", "PK_purchase", "amountOwed", "amountPaid", "createdAt", "notes", "purchaseDate", "status", "totalAmount", "totalItems", "updatedAt" FROM "tbpurchases";
DROP TABLE "tbpurchases";
ALTER TABLE "new_tbpurchases" RENAME TO "tbpurchases";
CREATE INDEX "tbpurchases_purchaseDate_idx" ON "tbpurchases"("purchaseDate");
CREATE TABLE "new_tbreservations" (
    "PK_reservation" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_customer" INTEGER NOT NULL,
    "FK_variant" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "expiresAt" DATETIME NOT NULL,
    "isDelivery" BOOLEAN NOT NULL DEFAULT false,
    "shippingAddress" TEXT,
    "FK_shippingAddress" INTEGER,
    "notes" TEXT,
    "updatedByEmployee" INTEGER,
    "waitingList" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbreservations_FK_shippingAddress_fkey" FOREIGN KEY ("FK_shippingAddress") REFERENCES "tbaddresses" ("PK_address") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbreservations_FK_customer_fkey" FOREIGN KEY ("FK_customer") REFERENCES "tbcustomer_profiles" ("PK_customer") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbreservations_FK_variant_fkey" FOREIGN KEY ("FK_variant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbreservations_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbreservations_updatedByEmployee_fkey" FOREIGN KEY ("updatedByEmployee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbreservations" ("FK_branch", "FK_customer", "FK_variant", "PK_reservation", "createdAt", "expiresAt", "isDelivery", "notes", "shippingAddress", "status", "updatedAt", "updatedByEmployee", "waitingList") SELECT "FK_branch", "FK_customer", "FK_variant", "PK_reservation", "createdAt", "expiresAt", "isDelivery", "notes", "shippingAddress", "status", "updatedAt", "updatedByEmployee", "waitingList" FROM "tbreservations";
DROP TABLE "tbreservations";
ALTER TABLE "new_tbreservations" RENAME TO "tbreservations";
CREATE TABLE "new_tbshipments" (
    "PK_shipment" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_order" INTEGER NOT NULL,
    "trackingNumber" TEXT,
    "carrier" TEXT,
    "status" TEXT NOT NULL,
    "shippedAt" DATETIME,
    "deliveredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbshipments_FK_order_fkey" FOREIGN KEY ("FK_order") REFERENCES "tborders" ("PK_order") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbshipments" ("FK_order", "PK_shipment", "carrier", "createdAt", "deliveredAt", "shippedAt", "status", "trackingNumber", "updatedAt") SELECT "FK_order", "PK_shipment", "carrier", "createdAt", "deliveredAt", "shippedAt", "status", "trackingNumber", "updatedAt" FROM "tbshipments";
DROP TABLE "tbshipments";
ALTER TABLE "new_tbshipments" RENAME TO "tbshipments";
CREATE UNIQUE INDEX "tbshipments_trackingNumber_key" ON "tbshipments"("trackingNumber");
CREATE TABLE "new_tbstockmovements" (
    "PK_movement" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_productvariant" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "FK_purchase" INTEGER,
    "movementType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbstockmovements_FK_productvariant_fkey" FOREIGN KEY ("FK_productvariant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstockmovements_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstockmovements_FK_purchase_fkey" FOREIGN KEY ("FK_purchase") REFERENCES "tbpurchases" ("PK_purchase") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbstockmovements" ("FK_branch", "FK_productvariant", "FK_purchase", "PK_movement", "createdAt", "movementType", "quantity", "reason", "updatedAt") SELECT "FK_branch", "FK_productvariant", "FK_purchase", "PK_movement", "createdAt", "movementType", "quantity", "reason", "updatedAt" FROM "tbstockmovements";
DROP TABLE "tbstockmovements";
ALTER TABLE "new_tbstockmovements" RENAME TO "tbstockmovements";
CREATE INDEX "tbstockmovements_createdAt_idx" ON "tbstockmovements"("createdAt");
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
    "updatedAt" DATETIME
);
INSERT INTO "new_tbsuppliers" ("PK_supplier", "address", "city", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt") SELECT "PK_supplier", "address", "city", "createdAt", "deletedAt", "department", "email", "firstName", "isActive", "lastName", "notes", "phone", "supplierNumber", "updatedAt" FROM "tbsuppliers";
DROP TABLE "tbsuppliers";
ALTER TABLE "new_tbsuppliers" RENAME TO "tbsuppliers";
CREATE UNIQUE INDEX "tbsuppliers_supplierNumber_key" ON "tbsuppliers"("supplierNumber");
CREATE TABLE "new_tbwarehouse_entry" (
    "PK_entry" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_purchase" INTEGER,
    "FK_employee_processor" INTEGER NOT NULL,
    "FK_productvariant" INTEGER NOT NULL,
    "FK_branch_location" INTEGER NOT NULL,
    "barCode" TEXT NOT NULL,
    "costPrice" DECIMAL,
    "salePrice" DECIMAL NOT NULL,
    "entryType" TEXT NOT NULL DEFAULT 'PURCHASE',
    "productStatus" TEXT NOT NULL DEFAULT 'EXCELLENT',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbwarehouse_entry_FK_purchase_fkey" FOREIGN KEY ("FK_purchase") REFERENCES "tbpurchases" ("PK_purchase") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouse_entry_FK_employee_processor_fkey" FOREIGN KEY ("FK_employee_processor") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouse_entry_FK_productvariant_fkey" FOREIGN KEY ("FK_productvariant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbwarehouse_entry_FK_branch_location_fkey" FOREIGN KEY ("FK_branch_location") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tbwarehouse_entry" ("FK_branch_location", "FK_employee_processor", "FK_productvariant", "FK_purchase", "PK_entry", "barCode", "costPrice", "createdAt", "entryType", "notes", "productStatus", "salePrice", "updatedAt") SELECT "FK_branch_location", "FK_employee_processor", "FK_productvariant", "FK_purchase", "PK_entry", "barCode", "costPrice", "createdAt", "entryType", "notes", "productStatus", "salePrice", "updatedAt" FROM "tbwarehouse_entry";
DROP TABLE "tbwarehouse_entry";
ALTER TABLE "new_tbwarehouse_entry" RENAME TO "tbwarehouse_entry";
CREATE UNIQUE INDEX "tbwarehouse_entry_barCode_key" ON "tbwarehouse_entry"("barCode");
CREATE INDEX "tbwarehouse_entry_createdAt_idx" ON "tbwarehouse_entry"("createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "tbsubscriptions_FK_company_key" ON "tbsubscriptions"("FK_company");

-- CreateIndex
CREATE INDEX "tbcart_items_FK_customer_createdAt_idx" ON "tbcart_items"("FK_customer", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tbcart_items_FK_customer_FK_variant_key" ON "tbcart_items"("FK_customer", "FK_variant");
