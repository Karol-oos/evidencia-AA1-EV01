# Documentación de Integración de Módulos

## 1. Arquitectura del Sistema
### 1.1 Capas
- **Capa de Presentación:** HTML, CSS, JavaScript (Frontend)
- **Capa de Aplicación:** Node.js + Express.js (API REST)
- **Capa de Datos:** MySQL + MySQL2 driver

### 1.2 Módulos Principales
#### Módulo de Autenticación
- **Responsabilidad:** Manejo de usuarios, registro, login, JWT
- **Endpoints:** /api/auth/register, /api/auth/login
- **Dependencias:** bcrypt, jsonwebtoken

#### Módulo de Productos
- **Responsabilidad:** CRUD de productos turísticos
- **Endpoints:** /api/products (GET, POST), /api/products/:id (GET)
- **Dependencias:** MySQL

#### Módulo de Contacto
- **Responsabilidad:** Recepción de mensajes de contacto
- **Endpoints:** /api/contact (POST)
- **Dependencias:** MySQL

## 2. Flujo de Integración

### 2.1 Frontend → Backend