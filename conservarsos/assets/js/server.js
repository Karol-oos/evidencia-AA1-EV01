const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB (si usas MongoDB)
require('./config/database');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar Swagger
const swaggerDocs = require('./config/swagger');
swaggerDocs(app);

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const contactRoutes = require('./routes/contact.routes');

// Usar rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/contact', contactRoutes);

// Rutas para páginas HTML
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

// Ruta para probar API
app.get('/api', (req, res) => {
  res.json({
    message: 'API de Conservar Sostenible funcionando',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      contact: '/api/contact',
      docs: '/api-docs'
    }
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    availableRoutes: {
      home: '/',
      contacto: '/contacto',
      servicios: '/servicios',
      tienda: '/tienda',
      reservaciones: '/reservaciones',
      apiDocs: '/api-docs'
    }
  });
});

// Middleware de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Ocurrió un error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
});