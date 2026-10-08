import { z } from "zod";

export const crearProductoSchema = z.object({
  sku: z.string().min(3).max(20),
  nombre: z.string().min(2).max(100),
  precio_venta: z.number().positive("El precio de venta debe ser mayor a 0"),
  precio_compra: z.number().positive("El precio de compra debe ser mayor a 0"),
  categoria_id: z.number().int().positive(),
  stock_minimo: z.number().int().min(0).default(0),
});

export const actualizarProductoSchema = crearProductoSchema.partial();
