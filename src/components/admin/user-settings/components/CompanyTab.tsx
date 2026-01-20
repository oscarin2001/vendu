"use client";

import { CompanyInfoSection } from "../company/CompanyInfoSection";
import { CountryChangeConfirmModal } from "../company/CountryChangeConfirmModal";
import { CountryChangeVerifyModal } from "../company/CountryChangeVerifyModal";
import { useCompanySettings } from "../hooks/useCompanySettings";

interface CompanyTabProps {
  userId: number;
}

export function CompanyTab({ userId }: CompanyTabProps) {
  const {
    loading,
    formData,
    fieldErrors,
    departmentOptions,
    currencyLabel,
    saving,
    canReset,
    expanded,
    confirmOpen,
    pendingCountry,
    nextCurrency,
    verifyOpen,
    confirmPassword,
    confirmPasswordError,
    companyNameInput,
    companyNameError,
    setExpanded,
    handleFieldChange,
    handleCountryRequest,
    handleCountryConfirm,
    handleCountryCancel,
    handleVerifyPasswordChange,
    handleVerifyCompanyNameChange,
    handleVerificationCancel,
    handleVerificationConfirm,
    handleDepartmentSelect,
    handleReset,
    handleSave,
  } = useCompanySettings(userId);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground">Empresa</h3>
      </div>

      <CompanyInfoSection
        data={formData}
        expanded={expanded}
        countryError={fieldErrors.country}
        departmentError={fieldErrors.department}
        departmentOptions={departmentOptions}
        currencyLabel={currencyLabel}
        saving={saving}
        canReset={canReset}
        onToggle={() => setExpanded(!expanded)}
        onFieldChange={handleFieldChange}
        onCountrySelect={handleCountryRequest}
        onDepartmentSelect={handleDepartmentSelect}
        onReset={handleReset}
        onSave={handleSave}
      />

      <CountryChangeConfirmModal
        open={confirmOpen}
        currentCountry={formData.country || ""}
        nextCountry={pendingCountry || ""}
        currentCurrency={currencyLabel}
        nextCurrency={nextCurrency}
        onCancel={handleCountryCancel}
        onConfirm={handleCountryConfirm}
      />

      <CountryChangeVerifyModal
        open={verifyOpen}
        companyName={formData.name || ""}
        nextCountry={pendingCountry || ""}
        password={confirmPassword}
        companyNameInput={companyNameInput}
        passwordError={confirmPasswordError}
        companyNameError={companyNameError}
        onPasswordChange={handleVerifyPasswordChange}
        onCompanyNameChange={handleVerifyCompanyNameChange}
        onCancel={handleVerificationCancel}
        onConfirm={handleVerificationConfirm}
      />
    </div>
  );
}
