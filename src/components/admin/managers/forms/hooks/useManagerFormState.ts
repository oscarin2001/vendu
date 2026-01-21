import { useState, useEffect } from "react";
import { ManagerFormData, ManagerFormProps } from "../types";

export function useManagerFormState({
  initialData,
  mode,
}: Pick<ManagerFormProps, "initialData" | "mode">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<ManagerFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    ci: initialData?.ci || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    password: "",
    confirmPassword: "",
    salary: initialData?.salary,
    branchIds: initialData?.branchIds,
    contributionType:
      initialData?.contributionType ||
      (!initialData?.salary || initialData.salary === 0 ? "none" : "paid"),
    hireDate: initialData?.hireDate || new Date(),
    birthDate: initialData?.birthDate,
    joinedAt: initialData?.joinedAt,
    contractEndAt: initialData?.contractEndAt,
    isIndefinite: initialData?.isIndefinite ?? !initialData?.contractEndAt,
    homeAddress: initialData?.homeAddress || "",
  });

  return {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    formData,
    setFormData,
  };
}
