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

Ejecutar en orden:

git clone https://github.com/DaviD-NP7/invenpro-api.git
cd invenpro-api
npm install
cp .env.example .env
node --env-file=.env src/db/migrate.js
npm run seed

## ⚙️ Variables de entorno

| Variable       | Descripción         | Ejemplo                |
| -------------- | ------------------- | ---------------------- |
| PORT           | Puerto del servidor | 3000                   |
| JWT_SECRET     | Secreto para JWT    | mi_secreto_seguro      |
| JWT_EXPIRES_IN | Duración del token  | 1d                     |
| DB_PATH        | Ruta SQLite         | ./data/invenpro.sqlite |
| NODE_ENV       | Entorno             | development            |

## 📜 Scripts disponibles

npm run dev # Servidor con --watch
npm start # Servidor en producción
npm test # Pruebas automatizadas
npm run seed # Cargar datos de prueba

## 👤 Usuarios de prueba

| Rol      | Email                 | Contraseña  |
| -------- | --------------------- | ----------- |
| Admin    | admin@invenpro.com    | admin123    |
| Vendedor | vendedor@invenpro.com | vendedor123 |

## 🔗 Endpoints

### Autenticación

| Método | Ruta           | Acceso      | Descripción      |
| ------ | -------------- | ----------- | ---------------- |
| POST   | /auth/registro | Admin       | Registra usuario |
| POST   | /auth/login    | Público     | Devuelve JWT     |
| GET    | /auth/yo       | Autenticado | Datos del token  |

### Categorías

| Método | Ruta        | Acceso      | Descripción      |
| ------ | ----------- | ----------- | ---------------- |
| GET    | /categorias | Autenticado | Lista categorías |
| POST   | /categorias | Admin       | Crea categoría   |

### Productos

| Método | Ruta           | Acceso      | Descripción         |
| ------ | -------------- | ----------- | ------------------- |
| GET    | /productos     | Autenticado | Listado con filtros |
| GET    | /productos/:id | Autenticado | Detalle             |
| POST   | /productos     | Admin       | Crea producto       |
| PATCH  | /productos/:id | Admin       | Actualiza campos    |
| DELETE | /productos/:id | Admin       | Desactiva producto  |

Filtros en /productos:

- ?buscar=leche
- ?categoria=1
- ?bajo_stock=true
- ?orden=precio
- ?orden=nombre

### Movimientos

| Método | Ruta         | Acceso      | Descripción         |
| ------ | ------------ | ----------- | ------------------- |
| GET    | /movimientos | Autenticado | Listado con filtros |
| POST   | /movimientos | Autenticado | Registra movimiento |

### Reportes

| Método | Ruta                 | Acceso      | Descripción          |
| ------ | -------------------- | ----------- | -------------------- |
| GET    | /reportes/stock-bajo | Autenticado | Productos bajo stock |
| GET    | /reportes/ventas     | Admin       | Ventas por fecha     |

## 📏 Reglas de negocio

- El stock nunca puede quedar negativo (409 Conflict).
- El stock solo cambia mediante /movimientos.
- El ajuste requiere motivo obligatorio.
- Un producto desactivado no admite movimientos.
- Solo el admin crea usuarios, productos y categorías.

## 🧪 Pruebas

npm test

Hay 10 pruebas automatizadas que cubren: 401, 403, 404, 201, 409, 400 y lógica de stock.

## 🌐 Despliegue

URL pública: https://invenpro-api-rz1t.onrender.com

## 📂 Estructura del proyecto

invenpro-api/
├── migrations/
├── seed/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── repositories/
│ ├── routes/
│ ├── services/
│ ├── validators/
│ ├── app.js
│ └── server.js
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md

## 👨‍💻 Autor

**DaviD-NP7**
Proyecto final - Backend con JavaScript - Nómada Bootcamp

## 📄 Licencia

ISC
