const supertest = require('supertest');
const { app, server } = require('../index');
const { GeneraToken } = require('../services/jwttoken.service');

const email = 'gvera@uv.mx';
const password = '@PatitoONM3';
const role = 'Administrador';
const api = supertest(app);
let token;

beforeAll(() => {
    token = GeneraToken(email, password, role);
});

describe('Roles API Tests', () => {
    test('GET /api/roles returns roles as JSON and with correct structure', async () => {
        const response = await api
            .get('/api/roles')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((rol) => {
            expect(rol.id).toBeDefined(); 
            expect(rol.nombre).toBeDefined();
        });
    });

    test('GET /api/roles without token fails with 401', async () => {
        await api
            .get('/api/roles')
            .expect(401);
    });
    
});

afterAll(() => {
    server.close();
});