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
CREATE INDEX "tbmanager_branches_FK_manager_idx" ON "tbmanager_branches"("FK_manager");

-- CreateIndex
CREATE INDEX "tbmanager_branches_FK_branch_idx" ON "tbmanager_branches"("FK_branch");

-- CreateIndex
CREATE UNIQUE INDEX "tbmanager_branches_FK_manager_FK_branch_key" ON "tbmanager_branches"("FK_manager", "FK_branch");
