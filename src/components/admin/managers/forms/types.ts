export interface SubmitData {
  firstName: string;
  lastName: string;
  ci: string;
  phone: string;
  email: string;
  password: string;
  salary?: number;
  branchIds?: number[];
  contributionType: "none" | "contributes" | "paid";
  hireDate?: Date;
}

export interface ManagerFormData extends SubmitData {
  confirmPassword: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  ci?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  salary?: string;
  branchIds?: string;
  contributionType?: string;
  hireDate?: string;
  general?: string;
}

export interface ManagerFormProps {
  tenantId: string;
  initialData?: {
    firstName: string;
    lastName: string;
    ci: string;
    phone: string;
    email: string;
    salary?: number;
    branchIds?: number[];
    contributionType?: "none" | "contributes" | "paid";
    hireDate?: Date;
  };
  branches: { id: number; name: string }[];
  onSubmit: (data: SubmitData) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
}
