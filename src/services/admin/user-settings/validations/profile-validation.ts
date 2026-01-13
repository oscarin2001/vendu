import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2, "Nombre requerido"),
  lastName: z.string().min(2, "Apellido requerido"),
  phone: z.string().optional(),
  ci: z.string().optional(),
});

export function validateProfile(data: unknown) {
  return profileSchema.parse(data);
}
