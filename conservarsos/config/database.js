const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "conservar_sostenible",
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
        console.error("❌ Error conectando a MySQL:", err.message);
    } else {
        console.log("✅ Conectado a MySQL!");
        connection.release();
    }
});

module.exports = pool.promise();