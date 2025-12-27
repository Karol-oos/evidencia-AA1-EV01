const mysql = require('mysql2');
require('dotenv').config();

// Configuración de la conexión
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'conservar_sostenible',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Probar conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err.message);
        console.error('🔧 Verifica que:');
        console.error('   1. MySQL esté instalado y corriendo');
        console.error('   2. Las credenciales en .env sean correctas');
        console.error('   3. La base de datos exista (ejecuta database/schema.sql)');
    } else {
        console.log('✅ Conectado a MySQL - Base de datos: conservar_sostenible');
        connection.release();
    }
});

module.exports = pool.promise();
