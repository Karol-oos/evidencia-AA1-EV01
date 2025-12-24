CREATE DATABASE IF NOT EXISTS conservar_sostenible;
USE conservar_sostenible;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),
    imagen VARCHAR(255),
    stock INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de contactos
CREATE TABLE contactos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    mensaje TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria, imagen) VALUES
('Kit de Jardinería Ecológica', 'Incluye herramientas biodegradables', 45.99, 'hogar', 'jardineria.jpg'),
('Bolsas Reutilizables', 'Pack de 5 bolsas de tela orgánica', 19.99, 'hogar', 'bolsas.jpg'),
('Filtro de Agua', 'Purificador de agua sin plástico', 89.99, 'salud', 'filtro.jpg'),
('Compresas Reutilizables', 'Pack de 3 compresas de algodón orgánico', 34.99, 'salud', 'compresas.jpg');