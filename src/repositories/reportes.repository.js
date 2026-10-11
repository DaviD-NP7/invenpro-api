import { db } from "../config/database.js";

export const reportesRepo = {
  stockBajo: () => {
    return db
      .prepare(
        `
      SELECT p.id, p.sku, p.nombre, p.stock_actual, p.stock_minimo,
             c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.activo = 1 AND p.stock_actual <= p.stock_minimo
      ORDER BY (p.stock_minimo - p.stock_actual) DESC
    `
      )
      .all();
  },

  ventas: (desde, hasta) => {
    // Total vendido y ganancia estimada
    const resumen = db
      .prepare(
        `
      SELECT 
        COUNT(DISTINCT m.id) AS total_movimientos,
        SUM(m.cantidad) AS total_unidades,
        SUM(m.cantidad * p.precio_venta) AS total_vendido,
        SUM(m.cantidad * (p.precio_venta - p.precio_compra)) AS ganancia_estimada
      FROM movimientos m
      JOIN productos p ON p.id = m.producto_id
      WHERE m.tipo = 'salida' AND m.creado_en BETWEEN ? AND ?
    `
      )
      .get(desde, hasta);

    // Top 5 productos más vendidos
    const topProductos = db
      .prepare(
        `
      SELECT p.id, p.sku, p.nombre,
             SUM(m.cantidad) AS unidades_vendidas,
             SUM(m.cantidad * p.precio_venta) AS total_vendido
      FROM movimientos m
      JOIN productos p ON p.id = m.producto_id
      WHERE m.tipo = 'salida' AND m.creado_en BETWEEN ? AND ?
      GROUP BY p.id, p.sku, p.nombre
      ORDER BY unidades_vendidas DESC
      LIMIT 5
    `
      )
      .all(desde, hasta);

    return { resumen, topProductos };
  },
};
