import { db } from "../config/database.js";

export const movimientosRepo = {
  findAll: (filtros = {}) => {
    let sql = `
      SELECT m.*, p.nombre AS producto_nombre, p.sku AS producto_sku,
             u.nombre AS usuario_nombre
      FROM movimientos m
      LEFT JOIN productos p ON p.id = m.producto_id
      LEFT JOIN usuarios u ON u.id = m.usuario_id
      WHERE 1=1
    `;
    const params = [];

    if (filtros.producto) {
      sql += " AND m.producto_id = ?";
      params.push(Number(filtros.producto));
    }
    if (filtros.tipo) {
      sql += " AND m.tipo = ?";
      params.push(filtros.tipo);
    }
    if (filtros.desde) {
      sql += " AND m.creado_en >= ?";
      params.push(filtros.desde);
    }
    if (filtros.hasta) {
      sql += " AND m.creado_en <= ?";
      params.push(filtros.hasta);
    }

    sql += " ORDER BY m.creado_en DESC";

    return db.prepare(sql).all(...params);
  },

  create: (data) => {
    const result = db
      .prepare(
        `
      INSERT INTO movimientos (producto_id, usuario_id, tipo, cantidad, motivo)
      VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(
        data.producto_id,
        data.usuario_id,
        data.tipo,
        data.cantidad,
        data.motivo || ""
      );

    return db
      .prepare("SELECT * FROM movimientos WHERE id = ?")
      .get(result.lastInsertRowid);
  },
};
