const supertest = require('supertest');
const { app, server } = require('../index');
const { GeneraToken } = require('../services/jwttoken.service');

const nombre = 'Create Categoria Test';
const email = 'gvera@uv.mx';
const password = '@PatitoONM3';
const role = 'Administrador';
const api = supertest(app);
let token;

beforeAll(() => {
    token = GeneraToken(email, password, role);
});


describe('Categorie API Tests', () => {
   test('POST api/categorias just return a 201 code and create a new categorie in database', async () => {
        await api
            .post('/api/categorias')
            .set('Authorization', `Bearer ${token}`)
            .send({nombre})
            .expect(201)
    });

    test('DELETE api categorias/1 just return a 204 code and delete the categorie from database', async () => {
        await api
            .delete('/api/categorias/22')
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
    });
});

afterAll(() => {
    server.close();
});