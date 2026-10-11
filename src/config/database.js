import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

const dbPath = process.env.DB_PATH || "./data/invenpro.sqlite";
const dir = path.dirname(dbPath);

// Crear la carpeta data si no existe
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

// Activar claves foráneas
db.exec("PRAGMA foreign_keys = ON;");
