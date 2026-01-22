-- CreateTable
CREATE TABLE "tbprivileges" (
    "PK_privilege" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "privilegeName" TEXT NOT NULL,
    "privilegeCode" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbprivileges_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbauth" (
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

-- CreateTable
CREATE TABLE "tbemployee_profiles" (
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
    "FK_createdBy" INTEGER,
    "theme" TEXT DEFAULT 'SYSTEM',
    "notifications" BOOLEAN DEFAULT true,
    "language" TEXT DEFAULT 'es',
    CONSTRAINT "tbemployee_profiles_FK_auth_fkey" FOREIGN KEY ("FK_auth") REFERENCES "tbauth" ("PK_auth") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbemployee_profiles_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbcustomer_profiles" (
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

-- CreateTable
CREATE TABLE "tbcash_sessions" (
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

-- CreateTable
CREATE TABLE "tbdevices" (
    "PK_device" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_auth" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbdevices_FK_auth_fkey" FOREIGN KEY ("FK_auth") REFERENCES "tbauth" ("PK_auth") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbpushsubscriptions" (
    "PK_pushsubscription" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_auth" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbpushsubscriptions_FK_auth_fkey" FOREIGN KEY ("FK_auth") REFERENCES "tbauth" ("PK_auth") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbbranches" (
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
    "openedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "FK_createdBy" INTEGER,
    "FK_updatedBy" INTEGER,
    CONSTRAINT "tbbranches_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbbranches_FK_updatedBy_fkey" FOREIGN KEY ("FK_updatedBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    "openedAt" DATETIME,
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

-- CreateTable
CREATE TABLE "tbbranchspecialdays" (
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

-- CreateTable
CREATE TABLE "tbattendances" (
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

-- CreateTable
CREATE TABLE "tbpayrolls" (
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

-- CreateTable
CREATE TABLE "tbgenders" (
    "PK_gender" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gender" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "tbcategories" (
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

-- CreateTable
CREATE TABLE "tbattributes" (
    "PK_attribute" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attribute" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "tbattributevalues" (
    "PK_value" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_attribute" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbattributevalues_FK_attribute_fkey" FOREIGN KEY ("FK_attribute") REFERENCES "tbattributes" ("PK_attribute") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbbrands" (
    "PK_brand" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "brandName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "tbseasons" (
    "PK_season" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "seasonName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tbproducts" (
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

-- CreateTable
CREATE TABLE "tbproductcategories" (
    "PK_productcategory" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_product" INTEGER NOT NULL,
    "FK_category" INTEGER NOT NULL,
    CONSTRAINT "tbproductcategories_FK_product_fkey" FOREIGN KEY ("FK_product") REFERENCES "tbproducts" ("PK_product") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbproductcategories_FK_category_fkey" FOREIGN KEY ("FK_category") REFERENCES "tbcategories" ("PK_category") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbproductvariants" (
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

-- CreateTable
CREATE TABLE "tbcompanies" (
    "PK_company" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "taxId" TEXT,
    "taxIdPath" TEXT,
    "businessName" TEXT,
    "fiscalAddress" TEXT,
    "country" TEXT,
    "department" TEXT,
    "commerceType" TEXT,
    "description" TEXT,
    "vision" TEXT,
    "mission" TEXT,
    "openedAt" DATETIME,
    "tosRead" BOOLEAN NOT NULL DEFAULT false,
    "tosReadAt" DATETIME,
    "tosAccepted" BOOLEAN NOT NULL DEFAULT false,
    "tosAcceptedAt" DATETIME,
    "tosAcceptedIp" TEXT,
    "tosAcceptedUa" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "FK_createdBy" INTEGER,
    CONSTRAINT "tbcompanies_FK_createdBy_fkey" FOREIGN KEY ("FK_createdBy") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);

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
CREATE TABLE "tbcompany_settings_history" (
    "PK_history" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_company" INTEGER NOT NULL,
    "FK_changedBy" INTEGER,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldValues" JSONB,
    "newValues" JSONB,
    "reason" TEXT,
    "changeType" TEXT NOT NULL DEFAULT 'UPDATE'
);

-- CreateTable
CREATE TABLE "tbaudit_logs" (
    "PK_log" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "entity" TEXT NOT NULL,
    "entityId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "FK_employee" INTEGER,
    "FK_company" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    CONSTRAINT "tbaudit_logs_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbaudit_logs_FK_company_fkey" FOREIGN KEY ("FK_company") REFERENCES "tbcompanies" ("PK_company") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbpermissions" (
    "PK_permission" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tbprivilege_permissions" (
    "FK_privilege" INTEGER NOT NULL,
    "FK_permission" INTEGER NOT NULL,

    PRIMARY KEY ("FK_privilege", "FK_permission")
);

-- CreateTable
CREATE TABLE "tbdomain_events" (
    "PK_event" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tbreport_snapshots" (
    "PK_snapshot" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reportType" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "tbprice_history" (
    "PK_price" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_variant" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "validFrom" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" DATETIME,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbprice_history_FK_variant_fkey" FOREIGN KEY ("FK_variant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbvariantattributes" (
    "PK_variantattribute" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_variant" INTEGER NOT NULL,
    "FK_attributevalue" INTEGER NOT NULL,
    CONSTRAINT "tbvariantattributes_FK_variant_fkey" FOREIGN KEY ("FK_variant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbvariantattributes_FK_attributevalue_fkey" FOREIGN KEY ("FK_attributevalue") REFERENCES "tbattributevalues" ("PK_value") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbstock_adjustments" (
    "PK_adjustment" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_variant" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "FK_employee" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "adjustmentType" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actionHistory" JSONB,
    CONSTRAINT "tbstock_adjustments_FK_variant_fkey" FOREIGN KEY ("FK_variant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstock_adjustments_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstock_adjustments_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbinventories" (
    "PK_inventory" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_productvariant" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "tbproductsPK_product" INTEGER,
    CONSTRAINT "tbinventories_FK_productvariant_fkey" FOREIGN KEY ("FK_productvariant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbinventories_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbinventories_tbproductsPK_product_fkey" FOREIGN KEY ("tbproductsPK_product") REFERENCES "tbproducts" ("PK_product") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbwarehouse_entry" (
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

-- CreateTable
CREATE TABLE "tbstock_transfers" (
    "PK_transfer" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_variant" INTEGER NOT NULL,
    "FK_origin" INTEGER NOT NULL,
    "FK_destination" INTEGER NOT NULL,
    "FK_employee_sender" INTEGER NOT NULL,
    "FK_employee_receiver" INTEGER,
    "quantity" INTEGER NOT NULL,
    "quantityReceived" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'IN_TRANSIT_EN',
    "notes" TEXT,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedAt" DATETIME,
    CONSTRAINT "tbstock_transfers_FK_origin_fkey" FOREIGN KEY ("FK_origin") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstock_transfers_FK_destination_fkey" FOREIGN KEY ("FK_destination") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstock_transfers_FK_variant_fkey" FOREIGN KEY ("FK_variant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstock_transfers_FK_employee_sender_fkey" FOREIGN KEY ("FK_employee_sender") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbstock_transfers_FK_employee_receiver_fkey" FOREIGN KEY ("FK_employee_receiver") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbcash_flows" (
    "PK_cashflow" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_branch" INTEGER NOT NULL,
    "FK_employee" INTEGER NOT NULL,
    "FK_session" INTEGER,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbcash_flows_FK_session_fkey" FOREIGN KEY ("FK_session") REFERENCES "tbcash_sessions" ("PK_session") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbcash_flows_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbcash_flows_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tborders" (
    "PK_order" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_customer" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "FK_seller" INTEGER NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "subtotal" DECIMAL NOT NULL DEFAULT 0,
    "shippingTotal" DECIMAL NOT NULL DEFAULT 0,
    "discount" DECIMAL NOT NULL DEFAULT 0,
    "grandTotal" DECIMAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT,
    "isDelivery" BOOLEAN NOT NULL DEFAULT false,
    "deliveryStatus" TEXT DEFAULT 'NOT_REQUIRED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tborders_FK_customer_fkey" FOREIGN KEY ("FK_customer") REFERENCES "tbcustomer_profiles" ("PK_customer") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tborders_FK_seller_fkey" FOREIGN KEY ("FK_seller") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbshipping_details" (
    "PK_shipping" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_order" INTEGER NOT NULL,
    "paymentMode" TEXT NOT NULL,
    "shippingCostPaidBy" TEXT,
    "destinationCity" TEXT NOT NULL,
    "destinationDept" TEXT NOT NULL,
    "carrierName" TEXT,
    "trackingNumber" TEXT,
    "receiverName" TEXT,
    "receiverPhone" TEXT,
    "shippingDate" DATETIME,
    "receiptImage" TEXT,
    CONSTRAINT "tbshipping_details_FK_order_fkey" FOREIGN KEY ("FK_order") REFERENCES "tborders" ("PK_order") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tborderitems" (
    "PK_orderitem" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_order" INTEGER NOT NULL,
    "FK_productvariant" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productStatus" TEXT,
    "skuSnapshot" TEXT,
    "unitPrice" DECIMAL NOT NULL,
    "totalPrice" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tborderitems_FK_order_fkey" FOREIGN KEY ("FK_order") REFERENCES "tborders" ("PK_order") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tborderitems_FK_productvariant_fkey" FOREIGN KEY ("FK_productvariant") REFERENCES "tbproductvariants" ("PK_variant") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbaddresses" (
    "PK_address" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_customer" INTEGER NOT NULL,
    "label" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbaddresses_FK_customer_fkey" FOREIGN KEY ("FK_customer") REFERENCES "tbcustomer_profiles" ("PK_customer") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbpayments" (
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

-- CreateTable
CREATE TABLE "tbshipments" (
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

-- CreateTable
CREATE TABLE "tbreviews" (
    "PK_review" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_product" INTEGER NOT NULL,
    "FK_customer" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbreviews_FK_product_fkey" FOREIGN KEY ("FK_product") REFERENCES "tbproducts" ("PK_product") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbreviews_FK_customer_fkey" FOREIGN KEY ("FK_customer") REFERENCES "tbcustomer_profiles" ("PK_customer") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbreservations" (
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

-- CreateTable
CREATE TABLE "tbstockmovements" (
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

-- CreateTable
CREATE TABLE "tbsuppliers" (
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

-- CreateTable
CREATE TABLE "tbsupplier_managers" (
    "PK_supplier_manager" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_supplier" INTEGER NOT NULL,
    "FK_manager" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbsupplier_managers_FK_supplier_fkey" FOREIGN KEY ("FK_supplier") REFERENCES "tbsuppliers" ("PK_supplier") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tbsupplier_managers_FK_manager_fkey" FOREIGN KEY ("FK_manager") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbsupplier_branches" (
    "PK_supplier_branch" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_supplier" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbsupplier_branches_FK_supplier_fkey" FOREIGN KEY ("FK_supplier") REFERENCES "tbsuppliers" ("PK_supplier") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tbsupplier_branches_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbpurchases" (
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

-- CreateTable
CREATE TABLE "tbpaymentsuppliers" (
    "PK_payment" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_purchase" INTEGER NOT NULL,
    "FK_employee" INTEGER NOT NULL,
    "amount" DECIMAL NOT NULL,
    "paymentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbpaymentsuppliers_FK_purchase_fkey" FOREIGN KEY ("FK_purchase") REFERENCES "tbpurchases" ("PK_purchase") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbpaymentsuppliers_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbshifts_schedule" (
    "PK_shift" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_employee" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "shiftType" TEXT NOT NULL DEFAULT 'NORMAL',
    "isHoliday" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "tbshifts_schedule_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbshifts_schedule_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbexpenses" (
    "PK_expense" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_branch" INTEGER NOT NULL,
    "FK_employee" INTEGER NOT NULL,
    "FK_session" INTEGER,
    "amount" DECIMAL NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "receiptPhoto" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbexpenses_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbexpenses_FK_employee_fkey" FOREIGN KEY ("FK_employee") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbexpenses_FK_session_fkey" FOREIGN KEY ("FK_session") REFERENCES "tbcash_sessions" ("PK_session") ON DELETE SET NULL ON UPDATE CASCADE
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

-- CreateTable
CREATE TABLE "tbmanager_branches" (
    "PK_manager_branch" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_manager" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbmanager_branches_FK_manager_fkey" FOREIGN KEY ("FK_manager") REFERENCES "tbemployee_profiles" ("PK_employee") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "tbmanager_branches_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tbprivileges_privilegeName_key" ON "tbprivileges"("privilegeName");

-- CreateIndex
CREATE UNIQUE INDEX "tbprivileges_privilegeCode_key" ON "tbprivileges"("privilegeCode");

-- CreateIndex
CREATE UNIQUE INDEX "tbauth_username_key" ON "tbauth"("username");

-- CreateIndex
CREATE UNIQUE INDEX "tbemployee_profiles_FK_auth_key" ON "tbemployee_profiles"("FK_auth");

-- CreateIndex
CREATE UNIQUE INDEX "tbemployee_profiles_ci_key" ON "tbemployee_profiles"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "tbcustomer_profiles_FK_auth_key" ON "tbcustomer_profiles"("FK_auth");

-- CreateIndex
CREATE UNIQUE INDEX "tbcustomer_profiles_phone_key" ON "tbcustomer_profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tbcustomer_profiles_email_key" ON "tbcustomer_profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tbcash_sessions_FK_branch_status_key" ON "tbcash_sessions"("FK_branch", "status");

-- CreateIndex
CREATE UNIQUE INDEX "tbdevices_FK_auth_key" ON "tbdevices"("FK_auth");

-- CreateIndex
CREATE UNIQUE INDEX "tbpushsubscriptions_endpoint_key" ON "tbpushsubscriptions"("endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "tbmanager_warehouses_FK_employee_FK_warehouse_key" ON "tbmanager_warehouses"("FK_employee", "FK_warehouse");

-- CreateIndex
CREATE UNIQUE INDEX "tbwarehouse_branches_FK_warehouse_FK_branch_key" ON "tbwarehouse_branches"("FK_warehouse", "FK_branch");

-- CreateIndex
CREATE UNIQUE INDEX "tbbranch_hours_FK_branch_day_of_week_key" ON "tbbranch_hours"("FK_branch", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "tbgenders_gender_key" ON "tbgenders"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "tbcategories_slug_key" ON "tbcategories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbbrands_brandName_key" ON "tbbrands"("brandName");

-- CreateIndex
CREATE UNIQUE INDEX "tbseasons_seasonName_key" ON "tbseasons"("seasonName");

-- CreateIndex
CREATE UNIQUE INDEX "tbproducts_sku_key" ON "tbproducts"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "tbproducts_slug_key" ON "tbproducts"("slug");

-- CreateIndex
CREATE INDEX "tbproducts_FK_brand_FK_season_isActive_idx" ON "tbproducts"("FK_brand", "FK_season", "isActive");

-- CreateIndex
CREATE INDEX "tbproducts_slug_idx" ON "tbproducts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbproductvariants_sku_key" ON "tbproductvariants"("sku");

-- CreateIndex
CREATE INDEX "tbproductvariants_FK_product_isPublished_isActive_idx" ON "tbproductvariants"("FK_product", "isPublished", "isActive");

-- CreateIndex
CREATE INDEX "tbproductvariants_sku_idx" ON "tbproductvariants"("sku");

-- CreateIndex
CREATE INDEX "tbproductvariants_isPublished_featured_isActive_idx" ON "tbproductvariants"("isPublished", "featured", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "tbcompanies_slug_key" ON "tbcompanies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tbcompanies_name_key" ON "tbcompanies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tbsubscriptions_FK_company_key" ON "tbsubscriptions"("FK_company");

-- CreateIndex
CREATE INDEX "tbcompany_settings_history_FK_company_idx" ON "tbcompany_settings_history"("FK_company");

-- CreateIndex
CREATE INDEX "tbcompany_settings_history_changedAt_idx" ON "tbcompany_settings_history"("changedAt");

-- CreateIndex
CREATE INDEX "tbaudit_logs_entity_entityId_idx" ON "tbaudit_logs"("entity", "entityId");

-- CreateIndex
CREATE INDEX "tbaudit_logs_FK_employee_idx" ON "tbaudit_logs"("FK_employee");

-- CreateIndex
CREATE INDEX "tbaudit_logs_createdAt_idx" ON "tbaudit_logs"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tbpermissions_code_key" ON "tbpermissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "tbinventories_FK_productvariant_FK_branch_key" ON "tbinventories"("FK_productvariant", "FK_branch");

-- CreateIndex
CREATE UNIQUE INDEX "tbwarehouse_entry_barCode_key" ON "tbwarehouse_entry"("barCode");

-- CreateIndex
CREATE INDEX "tbwarehouse_entry_createdAt_idx" ON "tbwarehouse_entry"("createdAt");

-- CreateIndex
CREATE INDEX "tbcash_flows_createdAt_idx" ON "tbcash_flows"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tborders_orderNumber_key" ON "tborders"("orderNumber");

-- CreateIndex
CREATE INDEX "tborders_FK_branch_status_idx" ON "tborders"("FK_branch", "status");

-- CreateIndex
CREATE INDEX "tborders_createdAt_idx" ON "tborders"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tbshipping_details_FK_order_key" ON "tbshipping_details"("FK_order");

-- CreateIndex
CREATE UNIQUE INDEX "tbpayments_transactionId_key" ON "tbpayments"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "tbshipments_trackingNumber_key" ON "tbshipments"("trackingNumber");

-- CreateIndex
CREATE INDEX "tbstockmovements_createdAt_idx" ON "tbstockmovements"("createdAt");

-- CreateIndex
CREATE INDEX "tbsupplier_managers_FK_supplier_idx" ON "tbsupplier_managers"("FK_supplier");

-- CreateIndex
CREATE INDEX "tbsupplier_managers_FK_manager_idx" ON "tbsupplier_managers"("FK_manager");

-- CreateIndex
CREATE UNIQUE INDEX "tbsupplier_managers_FK_supplier_FK_manager_key" ON "tbsupplier_managers"("FK_supplier", "FK_manager");

-- CreateIndex
CREATE INDEX "tbsupplier_branches_FK_supplier_idx" ON "tbsupplier_branches"("FK_supplier");

-- CreateIndex
CREATE INDEX "tbsupplier_branches_FK_branch_idx" ON "tbsupplier_branches"("FK_branch");

-- CreateIndex
CREATE UNIQUE INDEX "tbsupplier_branches_FK_supplier_FK_branch_key" ON "tbsupplier_branches"("FK_supplier", "FK_branch");

-- CreateIndex
CREATE INDEX "tbpurchases_purchaseDate_idx" ON "tbpurchases"("purchaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "tbshifts_schedule_FK_employee_date_key" ON "tbshifts_schedule"("FK_employee", "date");

-- CreateIndex
CREATE INDEX "tbcart_items_FK_customer_createdAt_idx" ON "tbcart_items"("FK_customer", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tbcart_items_FK_customer_FK_variant_key" ON "tbcart_items"("FK_customer", "FK_variant");

-- CreateIndex
CREATE INDEX "tbmanager_branches_FK_manager_idx" ON "tbmanager_branches"("FK_manager");

-- CreateIndex
CREATE INDEX "tbmanager_branches_FK_branch_idx" ON "tbmanager_branches"("FK_branch");

-- CreateIndex
CREATE UNIQUE INDEX "tbmanager_branches_FK_manager_FK_branch_key" ON "tbmanager_branches"("FK_manager", "FK_branch");
