// src/database/windows-setup.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🪟 ==============================================');
console.log('🪟  CONFIGURACIÓN PARA WINDOWS - PASO A PASO');
console.log('🪟 ==============================================\n');

console.log(' PASO 1: Verificando estructura de carpetas...\n');

// Verificar estructura de carpetas
const folders = [
    'src/database',
    'src/routes',
    'src/services',
    'src/controllers',
    'public/css',
    'public/js',
    'public/img'
];

folders.forEach(folder => {
    const folderPath = path.join(__dirname, '..', '..', folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(` Carpeta creada: ${folder}`);
    } else {
        console.log(` Carpeta existe: ${folder}`);
    }
});

console.log('\n📋 PASO 2: Creando archivos necesarios...\n');

// Archivos necesarios
const files = [
    {
        path: 'src/database/config.js',
        content: `const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'conservar_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};`
    },
    {
        path: 'src/database/setup.js',
        content: `const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
    console.log(' Iniciando configuración de base de datos...\\n');
    
    try {
        // Conectar a PostgreSQL
        const client = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: 'postgres'
        });
        
        await client.connect();
        console.log(' Conectado a PostgreSQL\\n');
        
        // Crear base de datos si no existe
        const dbName = process.env.DB_NAME || 'conservar_db';
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1", 
            [dbName]
        );
        
        if (result.rows.length === 0) {
            console.log(\` Creando base de datos: \${dbName}\`);
            await client.query(\`CREATE DATABASE \${dbName}\`);
            console.log(\` Base de datos \${dbName} creada\\n\`);
        } else {
            console.log(\` Base de datos \${dbName} ya existe\\n\`);
        }
        
        await client.end();
        
        // Conectar a la nueva base de datos para crear tablas
        const dbClient = new Client({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: dbName
        });
        
        await dbClient.connect();
        
        // Crear tablas
        console.log('📊 Creando tablas...\\n');
        
        const sql = \`
-- Usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Productos/Destinos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Contactos
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Carrusel
CREATE TABLE IF NOT EXISTS carousel_images (
    id SERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
        \`;
        
        await dbClient.query(sql);
        console.log(' Tablas creadas exitosamente\\n');
        
        await dbClient.end();
        
        console.log(' ¡Configuración completada!');
        console.log(' Ejecuta: npm run seed');
        
    } catch (error) {
        console.error(' Error:', error.message);
        console.log('\\n Verifica que:');
        console.log('   1. PostgreSQL esté instalado y corriendo');
        console.log('   2. Las credenciales en .env sean correctas');
        console.log('   3. Tengas permisos para crear bases de datos');
    }
}

setupDatabase();`
    },
    {
        path: 'src/database/seeder.js',
        content: `const bcrypt = require('bcryptjs');
const db = require('./config');

async function seedDatabase() {
    console.log('🌱 Insertando datos iniciales...\\n');
    
    try {
        // Insertar usuario admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await db.query(
            "INSERT INTO users (username, email, password, full_name, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING",
            ['admin', 'admin@conservar.com', hashedPassword, 'Administrador', 'admin']
        );
        
        console.log(' Usuario admin creado');
        
        // Insertar imágenes del carrusel
        const images = [
            ['/img/destino1.jpg', 'Montañas Verdes', 'Naturaleza en su máximo esplendor', 1],
            ['/img/destino2.jpg', 'Playas Cristalinas', 'Arena blanca y aguas turquesas', 2],
            ['/img/destino3.jpg', 'Selva Amazónica', 'Biodiversidad única en el mundo', 3],
            ['/img/destino4.jpg', 'Cascadas Escondidas', 'Agua pura desde las alturas', 4],
            ['/img/destino5.jpg', 'Ciudades Ancestrales', 'Cultura e historia viva', 5],
            ['/img/destino6.jpg', 'Auroras Boreales', 'Luz natural espectacular', 6]
        ];
        
        for (const image of images) {
            await db.query(
                "INSERT INTO carousel_images (image_url, title, description, display_order) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING",
                image
            );
        }
        
        console.log(' Imágenes del carrusel insertadas');
        
        // Insertar productos
        const products = [
            ['Montañas Verdes', 'Naturaleza en su máximo esplendor', 150.00, 'Aventura', 'Andes, Colombia', '/img/destino1.jpg', true],
            ['Playas Cristalinas', 'Arena blanca y aguas turquesas', 200.00, 'Playa', 'San Andrés, Colombia', '/img/destino2.jpg', true],
            ['Selva Amazónica', 'Biodiversidad única en el mundo', 250.00, 'Ecoturismo', 'Amazonas, Brasil', '/img/destino3.jpg', true]
        ];
        
        for (const product of products) {
            await db.query(
                "INSERT INTO products (name, description, price, category, location, image_url, is_featured) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING",
                product
            );
        }
        
        console.log(' Productos insertados');
       
        console.log('\\n ¡Datos iniciales insertados!');
        console.log('\\n Credenciales:');
        console.log('   Email: admin@conservar.com');
        console.log('   Contraseña: admin123');
        console.log('\\n URL: http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

seedDatabase();`
    }
];

files.forEach(file => {
    const filePath = path.join(__dirname, '..', '..', file.path);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.content);
        console.log(` Archivo creado: ${file.path}`);
    } else {
        console.log(` Archivo existe: ${file.path}`);
    }
});

console.log('\n PASO 3: Verificando archivos de configuración...\n');

// Verificar archivo .env
const envPath = path.join(__dirname, '..', '..', '.env');
if (!fs.existsSync(envPath)) {
    const envContent = `# Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=conservar_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# Configuración del servidor
PORT=3000
NODE_ENV=development

# JWT Secret (cambiar en producción)
JWT_SECRET=mi_secreto_jwt_para_desarrollo

# Configuración de imágenes
UPLOAD_DIR=public/img/uploads
MAX_FILE_SIZE=10485760  # 10MB`;
    
    fs.writeFileSync(envPath, envContent);
    console.log(' Archivo .env creado');
} else {
    console.log(' Archivo .env ya existe');
}

console.log('\n🪟 ==============================================');
console.log('🪟  CONFIGURACIÓN COMPLETADA');
console.log('🪟 ==============================================');
console.log('\n📝 PASOS SIGUIENTES:');
console.log('   1. Abre el archivo .env y configura tu contraseña de PostgreSQL');
console.log('   2. Asegúrate que PostgreSQL esté corriendo');
console.log('   3. Ejecuta: npm run setup');
console.log('   4. Ejecuta: npm run seed');
console.log('   5. Ejecuta: npm run dev');
console.log('\n🌐 Tu aplicación estará en: http://localhost:3000');