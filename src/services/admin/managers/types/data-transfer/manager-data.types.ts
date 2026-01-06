/**
 * Create manager data interface
 */
export interface CreateManagerData {
  firstName: string;
  lastName: string;
  ci: string;
  phone?: string;
  email: string;
  password: string;
  salary?: number;
  branchIds: number[];
  contributionType: "none" | "contributes" | "paid";
  hireDate?: Date;
}

/**
 * Update manager data interface
 */
export interface UpdateManagerData {
  firstName?: string;
  lastName?: string;
  ci?: string;
  phone?: string;
  email?: string;
  salary?: number;
  branchIds?: number[];
  contributionType?: "none" | "contributes" | "paid";
  hireDate?: Date;
}
