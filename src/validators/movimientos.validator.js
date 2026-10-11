import { z } from "zod";

export const crearMovimientoSchema = z.object({
  producto_id: z.number().int().positive(),
  tipo: z.enum(["entrada", "salida", "ajuste"]),
  cantidad: z
    .number()
    .int()
    .positive("La cantidad debe ser un entero mayor a 0"),
  motivo: z.string().max(255).optional().default(""),
});
