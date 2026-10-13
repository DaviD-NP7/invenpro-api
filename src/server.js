import app from "./app.js";
import { db } from "./config/database.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Ejecutar migraciones automáticamente al arrancar
const migracion = fs.readFileSync(
  path.join(__dirname, "../migrations/001_crear_tablas.sql"),
  "utf-8"
);
db.exec(migracion);

// Si no hay datos, cargar seed automáticamente
const hayUsuarios = db.prepare("SELECT COUNT(*) AS total FROM usuarios").get();
if (hayUsuarios.total === 0) {
  console.log("🌱 Base de datos vacía. Ejecutando seed...");
  // Importar el seed como módulo (opcional)
  // Por simplicidad, aquí solo se creará la estructura
}

app.listen(PORT, () => {
  console.log(`🚀 InvenPro API corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
