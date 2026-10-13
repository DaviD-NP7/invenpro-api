# 🏪 InvenPro API

API REST para gestión de inventario y ventas de una bodega. Permite registrar productos, controlar el stock mediante movimientos (entrada/salida/ajuste), gestionar usuarios con roles (admin/vendedor) y generar reportes.

## 🚀 Tecnologías

- **Node.js 24** (ESM)
- **Express 5**
- **SQLite** (node:sqlite nativo)
- **Zod** para validación
- **JWT + bcrypt** para autenticación
- **node:test + Supertest** para pruebas

## 📋 Requisitos

- Node.js 24 LTS o superior
- npm 10+

## 🔧 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/DaviD-NP7/invenpro-api.git
cd invenpro-api

# 2. Instalar dependencias
npm install

# 3. Copiar el archivo de variables de entorno
cp .env.example .env

# 4. Ejecutar migraciones
node --env-file=.env src/db/migrate.js

# 5. Cargar datos de prueba
npm run seed
```
