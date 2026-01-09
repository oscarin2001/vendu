export async function createCompanyFromOnboarding() {
  const sessionData = getOnboardingData();

  if (!sessionData.company) {
    throw new Error("Datos de empresa incompletos");
  }

  const companyData = sessionData.company;

  // Preparar los datos para saveCompanyData
  const formData = new FormData();
  formData.append("name", companyData.name || "");
  formData.append("country", companyData.country || "");
  formData.append("taxId", companyData.taxId || "");
  formData.append("department", companyData.department || "");
  formData.append("commerceType", companyData.commerceType || "");
  formData.append("description", companyData.description || "");
  formData.append("vision", companyData.vision || "");
  formData.append("mission", companyData.mission || "");
  formData.append("tosAccepted", "true");
  formData.append("tosRead", "true");

  // Crear la empresa
  const result = await saveCompanyData(formData);

  if (!result.success) {
    throw new Error(result.error || "Error al crear empresa");
  }

  // Aquí podríamos crear el owner como empleado, pero por ahora solo la empresa

  return result;
}