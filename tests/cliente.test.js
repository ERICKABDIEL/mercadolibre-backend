const supertest = require('supertest');
const { app, server } = require('../index');

const nombre = 'Usuario Test';
const email = 'test2@uv.mx';
const password = '@T3stP@ssw';
const confirmPassword = '@T3stP@ssw';
const rol = 'Usuario';
const api = supertest(app);

describe('Client API Tests', () => {
    test('POST api/clientes just return a 200 code', async () => {
        await api
            .post('/api/clientes')
            .send({nombre, email, password, confirmPassword, rol })
            .expect(201)
    });
});

afterAll(() => {
    server.close();
});