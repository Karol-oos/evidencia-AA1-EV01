const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares
app.use(cors());
app.use(express.json());

// 2. Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Conservar Sostenible',
      version: '1.0.0',
      description: 'Documentación de la API para el proyecto GA7-220501096-AA5-EV04',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  // Apunta a la misma carpeta donde están tus archivos de rutas
  apis: [`${__dirname}/*.js`], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// 3. Importar rutas (Ajustadas a tu carpeta actual assets/js)
// Asegúrate de que el nombre del archivo coincida exactamente
const authRoutes = require('./router_auth.routes.js'); 

// 4. Usar rutas
app.use('/api/auth', authRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Conservar Sostenible funcionando correctamente' });
});

// 5. Iniciar el servidor
app.listen(PORT, () => {
  console.log('==============================================');
  console.log(` API corriendo en: http://localhost:${PORT}`);
  console.log(` Swagger Docs en: http://localhost:${PORT}/api-docs`);
  console.log('==============================================');
});