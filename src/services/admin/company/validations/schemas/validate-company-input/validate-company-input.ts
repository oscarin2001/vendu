import { updateCompanySchema } from "../update-company-schema/";

export function validateCompanyInput(input: any) {
  return updateCompanySchema.safeParse(input);
}
