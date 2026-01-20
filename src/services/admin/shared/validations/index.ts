/**
 * Shared validation utilities - Re-export all validation functions
 */

// Name validations
export {
  validateNameLettersOnly,
  filterNameInput,
  validateFirstName,
  validateLastName,
  validateBusinessName,
} from "./name-validation";

// CI/DNI validations
export {
  validateCIByCountry,
  filterCIInput,
  getCIPlaceholder,
  getCIDocumentName,
  getCIConfigForCountry,
  getSupportedCICountries,
} from "./ci-validation";

// Salary validations
export {
  validateSalaryByCurrency,
  validateSalaryByCountry,
  formatSalary,
  getSalaryHint,
  getSalaryLimitsForCurrency,
  getCurrencySymbol,
  getCurrencyCode,
} from "./salary-validation";

// Address validations
export {
  validateAddress,
  validateCity,
  validateDepartment,
  validateCountry,
  getDepartmentsForCountry,
  getSupportedCountries,
} from "./address-validation";

// Field validations with character limits
export {
  FIELD_LIMITS,
  filterCityInput,
  validateCityName,
  filterEntityName,
  validateWarehouseName,
  validateBranchName,
  filterAddressInput,
  validateAddressField,
  getPlaceholderWithLimit,
  getRemainingChars,
} from "./field-validation";

// Re-export phone validation from config
export {
  validatePhoneByCountry,
  filterPhoneFirstDigit,
  getPhoneStartDigitsHint,
  getPhoneRulesForCountry,
} from "../../config/validations/phone-validation";
