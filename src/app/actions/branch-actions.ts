"use server";

import { createBranch } from "@/services/organization/services/branch-service";

export async function createBranchAction(
  input: any,
  tenantId: string,
  actor: any
) {
  const companyId = Number(tenantId);
  if (Number.isNaN(companyId)) throw new Error("tenantId inválido");
  return createBranch(input, companyId, actor);
}
