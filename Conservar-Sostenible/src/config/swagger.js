const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Conservar Sostenible',
      version: '1.0.0',
      description: 'API para la gestión de productos sostenibles y autenticación de usuarios',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'soporte@conservarsostenible.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://api.conservarsostenible.com',
        description: 'Servidor de producción'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario'
            },
            name: {
              type: 'string',
              description: 'Nombre completo del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña encriptada'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            price: {
              type: 'number'
            },
            category: {
              type: 'string'
            },
            image: {
              type: 'string',
              description: 'URL de la imagen'
            },
            stock: {
              type: 'integer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Contact: {
          type: 'object',
          required: ['name', 'email', 'message'],
          properties: {
            name: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            message: {
              type: 'string'
            },
            phone: {
              type: 'string'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            token: {
              type: 'string',
              description: 'Token JWT para autenticación'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            error: {
              type: 'string'
            },
            stack: {
              type: 'string'
            }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js'] // Rutas donde buscarás la documentación
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Ruta para la documentación Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'API Conservar Sostenible',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/favicon.ico'
  }));

  // Ruta para obtener el JSON de Swagger
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`📚 Documentación Swagger disponible en: http://localhost:${process.env.PORT || 3000}/api-docs`);
};

module.exports = swaggerDocs;