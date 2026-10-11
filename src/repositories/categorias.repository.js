import { db } from "../config/database.js";

export const categoriasRepo = {
  findAll: () => {
    return db
      .prepare(
        `
      SELECT c.id, c.nombre, c.descripcion,
             COUNT(p.id) AS total_productos
      FROM categorias c
      LEFT JOIN productos p ON p.categoria_id = c.id AND p.activo = 1
      GROUP BY c.id, c.nombre, c.descripcion
      ORDER BY c.nombre
    `
      )
      .all();
  },

  findById: (id) => {
    return db.prepare("SELECT * FROM categorias WHERE id = ?").get(id);
  },

  create: (data) => {
    const result = db
      .prepare("INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)")
      .run(data.nombre, data.descripcion || "");
    return categoriasRepo.findById(result.lastInsertRowid);
  },

  existsNombre: (nombre) => {
    const row = db
      .prepare("SELECT id FROM categorias WHERE nombre = ?")
      .get(nombre);
    return !!row;
  },
};
