"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getCountryConfigByName } from "@/services/admin/config";
import {
  getCompanySettings,
  updateCompanySettings,
} from "@/services/admin/user-settings";
import { validateAdminPassword } from "@/services/admin/managers";
import { CompanyFormState } from "../company/types";

const EMPTY_STATE: CompanyFormState = {
  name: "",
  taxId: "",
  businessName: "",
  fiscalAddress: "",
  country: "",
  department: "",
  currency: "",
};

interface UseCompanySettingsResult {
  loading: boolean;
  formData: CompanyFormState;
  initialData: CompanyFormState | null;
  fieldErrors: { country?: string; department?: string };
  departmentOptions: string[];
  currencyLabel?: string;
  saving: boolean;
  canReset: boolean;
  expanded: boolean;
  confirmOpen: boolean;
  pendingCountry: string | null;
  nextCurrency?: string;
  verifyOpen: boolean;
  confirmPassword: string;
  confirmPasswordError?: string;
  companyNameInput: string;
  companyNameError?: string;
  setExpanded: (value: boolean) => void;
  handleFieldChange: (field: keyof CompanyFormState, value: string) => void;
  handleCountryRequest: (country: string) => void;
  handleCountryConfirm: () => void;
  handleCountryCancel: () => void;
  handleVerifyPasswordChange: (value: string) => void;
  handleVerifyCompanyNameChange: (value: string) => void;
  handleVerificationCancel: () => void;
  handleVerificationConfirm: () => Promise<void>;
  handleDepartmentSelect: (department: string) => void;
  handleReset: () => void;
  handleSave: () => Promise<void>;
}

export function useCompanySettings(
  employeeId?: number
): UseCompanySettingsResult {
  const params = useParams<{ tenantId?: string }>();
  const tenantId = params?.tenantId;

  const [formData, setFormData] = useState<CompanyFormState>(EMPTY_STATE);
  const [initialData, setInitialData] = useState<CompanyFormState | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ country?: string; department?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpandedState] = useState(true);
  const [pendingCountry, setPendingCountry] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(
    undefined
  );
  const [companyNameInput, setCompanyNameInput] = useState("");
  const [companyNameError, setCompanyNameError] = useState<string | undefined>(
    undefined
  );

  const resetVerificationState = () => {
    setConfirmPassword("");
    setConfirmPasswordError(undefined);
    setCompanyNameInput("");
    setCompanyNameError(undefined);
  };

  useEffect(() => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const company = await getCompanySettings(tenantId);
        const nextState: CompanyFormState = {
          name: company.name || "",
          taxId: company.taxId || "",
          businessName: company.businessName || "",
          fiscalAddress: company.fiscalAddress || "",
          country: company.country || "",
          department: company.department || "",
          currency: "",
        };
        const config = getCountryConfigByName(nextState.country);
        nextState.currency = config?.currency.code || "";
        setFormData(nextState);
        setInitialData({ ...nextState });
      } catch (error) {
        toast.error("Error cargando empresa");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tenantId]);

  const countryConfig = useMemo(
    () => getCountryConfigByName(formData.country),
    [formData.country]
  );

  const departmentOptions = useMemo(
    () => countryConfig?.departments || [],
    [countryConfig]
  );

  const currencyLabel = useMemo(() => {
    if (countryConfig) {
      const { symbol, code } = countryConfig.currency;
      return `${symbol} ${code}`;
    }
    return formData.currency ? formData.currency : undefined;
  }, [countryConfig, formData.currency]);

  const canReset = useMemo(() => {
    if (!initialData) return false;
    return [
      "name",
      "taxId",
      "businessName",
      "fiscalAddress",
      "country",
      "department",
      "currency",
    ].some(
      (key) =>
        formData[key as keyof CompanyFormState] !==
        initialData[key as keyof CompanyFormState]
    );
  }, [formData, initialData]);

  const nextCountryConfig = pendingCountry
    ? getCountryConfigByName(pendingCountry)
    : undefined;

  const handleFieldChange = (field: keyof CompanyFormState, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryRequest = (country: string) => {
    if (!country || country === formData.country) {
      return;
    }
    setPendingCountry(country);
    setConfirmOpen(true);
  };

  const handleCountryConfirm = () => {
    if (!pendingCountry) {
      return;
    }
    setConfirmOpen(false);
    setVerifyOpen(true);
  };

  const handleCountryCancel = () => {
    setPendingCountry(null);
    setConfirmOpen(false);
    resetVerificationState();
  };

  const handleVerificationCancel = () => {
    resetVerificationState();
    setVerifyOpen(false);
    setPendingCountry(null);
  };

  const handleVerificationConfirm = async () => {
    let hasError = false;
    const expectedName = (formData.name || "").trim();
    const nameInput = companyNameInput.trim();
    const passwordInput = confirmPassword.trim();

    if (!nameInput) {
      setCompanyNameError("Debes escribir el nombre de la empresa");
      hasError = true;
    } else if (expectedName && nameInput !== expectedName) {
      setCompanyNameError("El nombre no coincide exactamente");
      hasError = true;
    } else {
      setCompanyNameError(undefined);
    }

    if (!passwordInput) {
      setConfirmPasswordError("La contraseña es obligatoria");
      hasError = true;
    } else if (passwordInput.length < 6) {
      setConfirmPasswordError("La contraseña debe tener al menos 6 caracteres");
      hasError = true;
    } else {
      setConfirmPasswordError(undefined);
    }

    if (hasError || !pendingCountry) {
      return;
    }

    if (!tenantId) {
      toast.error("No se encontro el tenant");
      return;
    }

    try {
      await validateAdminPassword({
        tenantId,
        password: passwordInput,
        employeeId,
      });
      setConfirmPasswordError(undefined);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "La contraseña no coincide";
      setConfirmPasswordError(
        message.includes("al menos 6 caracteres")
          ? message
          : "La contraseña no coincide"
      );
      return;
    }

    const config = getCountryConfigByName(pendingCountry);
    setFormData((prev) => ({
      ...prev,
      country: pendingCountry,
      department: "",
      currency: config?.currency.code || prev.currency,
    }));
    setFieldErrors((prev) => ({ ...prev, country: undefined, department: undefined }));
    resetVerificationState();
    setPendingCountry(null);
    setVerifyOpen(false);
  };

  const handleDepartmentSelect = (department: string) => {
    setFieldErrors((prev) => ({ ...prev, department: undefined }));
    setFormData((prev) => ({ ...prev, department }));
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({ ...initialData });
      setFieldErrors({});
    }
  };

  const handleSave = async () => {
    if (!tenantId) {
      toast.error("No se encontro el tenant");
      return;
    }

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      toast.error("El nombre es obligatorio");
      return;
    }

    const countryError = formData.country ? undefined : "Selecciona un pais";
    const departmentError =
      departmentOptions.length > 0 && !formData.department
        ? "Selecciona un departamento"
        : undefined;

    if (countryError || departmentError) {
      setFieldErrors({ country: countryError, department: departmentError });
      return;
    }

    try {
      setSaving(true);
      const result = await updateCompanySettings(tenantId, {
        name: trimmedName,
        taxId: formData.taxId.trim() || undefined,
        businessName: formData.businessName.trim() || undefined,
        fiscalAddress: formData.fiscalAddress.trim() || undefined,
        country: formData.country || undefined,
        department: formData.department || undefined,
      });

      const config = getCountryConfigByName(result.country || "");
      const updated: CompanyFormState = {
        name: result.name || trimmedName,
        taxId: result.taxId || "",
        businessName: result.businessName || "",
        fiscalAddress: result.fiscalAddress || "",
        country: result.country || formData.country,
        department: result.department || "",
        currency: config?.currency.code || formData.currency,
      };

      setFormData(updated);
      setInitialData({ ...updated });
      toast.success("Empresa actualizada");
    } catch (error) {
      toast.error("Error guardando empresa");
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    formData,
    initialData,
    fieldErrors,
    departmentOptions,
    currencyLabel,
    saving,
    canReset,
    expanded,
    confirmOpen,
    pendingCountry,
    nextCurrency: nextCountryConfig?.currency.code,
    verifyOpen,
    confirmPassword,
    confirmPasswordError,
    companyNameInput,
    companyNameError,
    setExpanded: (value: boolean) => setExpandedState(value),
    handleFieldChange,
    handleCountryRequest,
    handleCountryConfirm,
    handleCountryCancel,
    handleVerifyPasswordChange: setConfirmPassword,
    handleVerifyCompanyNameChange: setCompanyNameInput,
    handleVerificationCancel,
    handleVerificationConfirm,
    handleDepartmentSelect,
    handleReset,
    handleSave,
  };
}
