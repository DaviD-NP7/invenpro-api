import { z } from "zod";

export const crearCategoriaSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100),
  descripcion: z.string().max(255).optional().default(""),
});
