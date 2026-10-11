import { db } from "../config/database.js";

export const productosRepo = {
  findAll: (filtros = {}) => {
    let sql = `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.activo = 1
    `;
    const params = [];

    if (filtros.buscar) {
      sql += " AND p.nombre LIKE ?";
      params.push(`%${filtros.buscar}%`);
    }
    if (filtros.categoria) {
      sql += " AND p.categoria_id = ?";
      params.push(Number(filtros.categoria));
    }
    if (filtros.bajo_stock === "true") {
      sql += " AND p.stock_actual <= p.stock_minimo";
    }

    if (filtros.orden === "precio") {
      sql += " ORDER BY p.precio_venta ASC";
    } else if (filtros.orden === "nombre") {
      sql += " ORDER BY p.nombre ASC";
    } else {
      sql += " ORDER BY p.id ASC";
    }

    return db.prepare(sql).all(...params);
  },

  findById: (id) => {
    return db
      .prepare(
        `
      SELECT p.*, c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      WHERE p.id = ? AND p.activo = 1
    `
      )
      .get(id);
  },

  create: (data) => {
    const result = db
      .prepare(
        `
      INSERT INTO productos (sku, nombre, precio_venta, precio_compra, categoria_id, stock_minimo, stock_actual)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `
      )
      .run(
        data.sku,
        data.nombre,
        data.precio_venta,
        data.precio_compra,
        data.categoria_id,
        data.stock_minimo || 0
      );
    return productosRepo.findById(result.lastInsertRowid);
  },

  update: (id, data) => {
    const campos = [];
    const valores = [];
    const permitidos = [
      "sku",
      "nombre",
      "precio_venta",
      "precio_compra",
      "categoria_id",
      "stock_minimo",
    ];

    for (const campo of permitidos) {
      if (data[campo] !== undefined) {
        campos.push(`${campo} = ?`);
        valores.push(data[campo]);
      }
    }

    if (campos.length === 0) return productosRepo.findById(id);

    valores.push(id);
    db.prepare(
      `UPDATE productos SET ${campos.join(", ")} WHERE id = ? AND activo = 1`
    ).run(...valores);
    return productosRepo.findById(id);
  },

  remove: (id) => {
    const result = db
      .prepare("UPDATE productos SET activo = 0 WHERE id = ? AND activo = 1")
      .run(id);
    return result.changes > 0;
  },

  existsSku: (sku) => {
    const row = db
      .prepare("SELECT id FROM productos WHERE sku = ? AND activo = 1")
      .get(sku);
    return !!row;
  },
};
