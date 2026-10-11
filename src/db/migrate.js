import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "../config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "../../migrations");

export function ejecutarMigraciones() {
  const archivos = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`🔧 Ejecutando ${archivos.length} migración(es)...`);

  for (const archivo of archivos) {
    const contenido = fs.readFileSync(
      path.join(migrationsDir, archivo),
      "utf-8"
    );
    db.exec(contenido);
    console.log(`   ✅ ${archivo}`);
  }

  console.log("✨ Migraciones completadas");
}

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  ejecutarMigraciones();
}
