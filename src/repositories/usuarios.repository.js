import { db } from "../config/database.js";

export const usuariosRepo = {
  findByEmail: (email) => {
    return db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
  },

  findById: (id) => {
    return db
      .prepare(
        "SELECT id, nombre, email, rol, creado_en FROM usuarios WHERE id = ?"
      )
      .get(id);
  },

  create: (data) => {
    const result = db
      .prepare(
        `
      INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES (?, ?, ?, ?)
    `
      )
      .run(data.nombre, data.email, data.password_hash, data.rol || "vendedor");

    return usuariosRepo.findById(result.lastInsertRowid);
  },
};
