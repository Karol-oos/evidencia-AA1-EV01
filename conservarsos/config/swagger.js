const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Conservar Sostenible',
            version: '1.0.0',
            description: 'API para gestión de productos sostenibles',
            contact: {
                name: 'Soporte',
                email: 'soporte@conservarsostenible.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local'
            }
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    required: ['nombre', 'email', 'password'],
                    properties: {
                        nombre: { type: 'string', example: 'Juan Pérez' },
                        email: { type: 'string', format: 'email', example: 'juan@example.com' },
                        password: { type: 'string', format: 'password', example: '123456' }
                    }
                },
                Product: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string', example: 'Producto Ecológico' },
                        descripcion: { type: 'string', example: 'Descripción del producto' },
                        precio: { type: 'number', example: 29.99 },
                        categoria: { type: 'string', example: 'hogar' },
                        imagen: { type: 'string', example: 'producto.jpg' }
                    }
                },
                Contact: {
                    type: 'object',
                    required: ['nombre', 'email', 'mensaje'],
                    properties: {
                        nombre: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        telefono: { type: 'string' },
                        mensaje: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js', './controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api-docs.json', (req, res) => {
        res.json(swaggerSpec);
    });
    console.log('📚 Swagger en http://localhost:3000/api-docs');
};

module.exports = swaggerDocs;