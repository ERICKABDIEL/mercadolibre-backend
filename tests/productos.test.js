const supertest = require('supertest');
const { app, server } = require('../index');
const { GeneraToken } = require('../services/jwttoken.service');

const email = 'gvera@uv.mx';
const password = '@PatitoONM3';
const role = 'Administrador';

const titulo = 'Producto Test';
const descripcion = 'Producto de prueba';
const precio = 100.00;
const stringPrecio = '100.00';

const api = supertest(app);

let token;
beforeAll(() => {
    token = GeneraToken(email, password, role);
});

describe('Product API Tests', () => {
    test('POST api/productos returns 201 and a product as JSON', async () => {
        await api
            .post('/api/productos')
            .set('Authorization', `Bearer ${token}`)
            .send({ titulo, descripcion, precio })
            .expect(201)
            .expect('Content-Type', /application\/json/);
    });

    test('POST api/productos returns a 400 code when missing data', async () => {
        await api
            .post('/api/productos')
            .set('Authorization', `Bearer ${token}`)
            .send({ titulo, descripcion })
            .expect(400);
    });

    test('POST api/productos returns a 400 code when data is invalid', async () => {
        await api
            .post('/api/productos')
            .set('Authorization', `Bearer ${token}`)
            .send({ titulo, descripcion, stringPrecio })
            .expect(400);
    });

    test('GET api/productos returns a list of products as JSON', async () => {
        const response = await api
            .get('/api/productos')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((producto) => {
            expect(producto.productoId).toBeDefined();
            expect(producto.titulo).toBeDefined();
            expect(producto.descripcion).toBeDefined();
            expect(producto.precio).toBeDefined();
        });
    });

    test('GET api/productos/:id returns a product as JSON', async () => {
        const response = await api
            .get('/api/productos/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(response.body.productoId).toBeDefined();
        expect(response.body.titulo).toBeDefined();
        expect(response.body.descripcion).toBeDefined();
        expect(response.body.precio).toBeDefined();
    });

    test('GET api/productos/:id returns 404 when product does not exist', async () => {
        await api
            .get('/api/productos/472')
            .set('Authorization', `Bearer ${token}`)
            .expect(404);
    });
});

afterAll(() => {
    server.close();
});