const supertest = require('supertest');
const { app, server } = require('../index');
const { GeneraToken } = require('../services/jwttoken.service');

const email = 'gvera@uv.mx';
const password = '@PatitoONM3';
const role = 'Administrador';
const api = supertest(app);
let token;
const fileId = 1;

beforeAll(() => {
    token = GeneraToken(email, password, role);
});

describe('Archivos Detalle API Tests', () => {
    test('GET api/archivos/:id/detalle returns a file', async () => {
        const response = await api
            .get('/api/archivos/' + fileId + '/detalle')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body.archivoid).toBeDefined();
        expect(response.body.mime).toBeDefined();
        expect(response.body.nombre).toBeDefined();
        expect(response.body.size).toBeDefined();
        expect(response.body.indb).toBeDefined();
    });

    test('GET /api/archivos/:id/detalle with wrong id fails with 404', async () => {
        await api
            .get('/api/archivos/0/detalle')
            .set('Authorization', `Bearer ${token}`)
    });
    
});

afterAll(() => {
    server.close();
});