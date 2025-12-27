// src/database/setup.js
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    console.log('🚀 Iniciando configuración de la base de datos...\n');
    
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: 'postgres' // Conectarse a la base de datos por defecto
    });

    try {
        await client.connect();
        console.log('✅ Conectado a PostgreSQL\n');

        // 1. Crear la base de datos si no existe
        const dbName = process.env.DB_NAME || 'conservar_db';
        console.log(`📋 Verificando base de datos: ${dbName}`);
        
        const dbCheck = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`, 
            [dbName]
        );

        if (dbCheck.rows.length === 0) {
            console.log(`📁 Creando base de datos: ${dbName}`);
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`✅ Base de datos ${dbName} creada\n`);
        } else {
            console.log(`✅ Base de datos ${dbName} ya existe\n`);
        }

        // 2. Conectar a la nueva base de datos
        await client.end();
        
        const dbClient = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: dbName
        });

        await dbClient.connect();
        console.log(`✅ Conectado a la base de datos: ${dbName}\n`);

        // 3. Crear tablas
        console.log('📊 Creando tablas...\n');
        
        const createTablesSQL = `
-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Tabla de productos/destinos turísticos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);

-- Tabla de contactos/consultas
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de reservaciones
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    reservation_date DATE NOT NULL,
    number_of_people INTEGER NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla para imágenes del carrusel
CREATE TABLE IF NOT EXISTS carousel_images (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
        `;

        await dbClient.query(createTablesSQL);
        console.log('✅ Tablas creadas exitosamente\n');

        // 4. Crear índices
        console.log('📈 Creando índices...\n');
        
        const createIndexesSQL = `
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_reservations_user ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_carousel_active ON carousel_images(is_active);
CREATE INDEX IF NOT EXISTS idx_carousel_order ON carousel_images(display_order);
        `;

        await dbClient.query(createIndexesSQL);
        console.log('✅ Índices creados exitosamente\n');

        // 5. Verificar tablas creadas
        console.log('🔍 Verificando tablas creadas...\n');
        const tables = await dbClient.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        console.log('📋 Tablas en la base de datos:');
        tables.rows.forEach(table => {
            console.log(`   - ${table.table_name}`);
        });

        await dbClient.end();
        
        console.log('\n🎉 ¡Configuración de base de datos completada exitosamente!');
        console.log('\n📝 Pasos siguientes:');
        console.log('   1. Ejecuta: npm run seed');
        console.log('   2. Ejecuta: npm run dev');
        console.log('   3. Visita: http://localhost:3000\n');

    } catch (error) {
        console.error('❌ Error durante la configuración:', error.message);
        console.error('\n🔧 Solución de problemas:');
        console.error('   1. Verifica que PostgreSQL esté instalado y corriendo');
        console.error('   2. Verifica las credenciales en el archivo .env');
        console.error('   3. Asegúrate de tener permisos para crear bases de datos\n');
        process.exit(1);
    }
}

setupDatabase();