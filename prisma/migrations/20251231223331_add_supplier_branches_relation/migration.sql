-- CreateTable
CREATE TABLE "tbsupplier_branches" (
    "PK_supplier_branch" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "FK_supplier" INTEGER NOT NULL,
    "FK_branch" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tbsupplier_branches_FK_supplier_fkey" FOREIGN KEY ("FK_supplier") REFERENCES "tbsuppliers" ("PK_supplier") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tbsupplier_branches_FK_branch_fkey" FOREIGN KEY ("FK_branch") REFERENCES "tbbranches" ("PK_branch") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "tbsupplier_branches_FK_supplier_idx" ON "tbsupplier_branches"("FK_supplier");

-- CreateIndex
CREATE INDEX "tbsupplier_branches_FK_branch_idx" ON "tbsupplier_branches"("FK_branch");

-- CreateIndex
CREATE UNIQUE INDEX "tbsupplier_branches_FK_supplier_FK_branch_key" ON "tbsupplier_branches"("FK_supplier", "FK_branch");
