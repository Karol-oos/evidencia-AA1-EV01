const request = require('supertest');
const app = require('../server');

describe('Módulo de Autenticación', () => {
    test('POST /api/auth/register - Debe registrar usuario', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('token');
    });
    
    test('POST /api/auth/login - Debe autenticar usuario', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('user');
    });
});