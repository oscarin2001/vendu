/**
 * Validadores para inputs de configuración de empresa.
 */

import { z } from "zod";

export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(1, "Nombre requerido")
    .max(100, "Nombre demasiado largo"),
  nit: z.string().optional(),
  country: z.string().min(1, "País requerido"),
  address: z.string().min(1, "Dirección requerida"),
});
