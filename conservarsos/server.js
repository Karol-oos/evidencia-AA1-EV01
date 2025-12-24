const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// Configurar Swagger
const swaggerDocs = require('./config/swagger');
swaggerDocs(app);

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const contactRoutes = require('./routes/contact.routes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);

// Servir páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contacto', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'contacto.html'));
});

app.get('/servicios', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'servicios.html'));
});

app.get('/tienda', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tienda.html'));
});

app.get('/reservaciones', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'reservaciones.html'));
});

// Ruta API principal
app.get('/api', (req, res) => {
    res.json({
        message: 'API Conservar Sostenible',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            contact: '/api/contact',
            docs: '/api-docs'
        }
    });
});

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
    console.log(`📚 Swagger: http://localhost:${PORT}/api-docs`);
});