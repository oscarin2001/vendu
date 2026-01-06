import { z } from "zod";
import { updateCompanySchema } from "../schemas/update-company-schema";

export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
