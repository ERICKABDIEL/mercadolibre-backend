const supertest = require('supertest');
const { app, server } = require('../index');
const { GeneraToken } = require('../services/jwttoken.service');

const email = 'gvera@uv.mx';
const password = '@PatitoONM3';
const role = 'Administrador';
const emailUsuario = 'patito@uv.mx';
const usuarioRole = 'Usuario';
const api = supertest(app);
let token;
let tokenUsuario;

beforeAll(() => {
    token = GeneraToken(email, password, role);
    tokenUsuario = GeneraToken(emailUsuario, password, usuarioRole);
});

describe('Pedidos API Tests', () => {
    test('GET /api/pedidos returns pedidos as JSON and with correct structure', async () => {
        const response = await api
            .get('/api/pedidos')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);

        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach((pedido) => {
            expect(pedido.pedidoId).toBeDefined();
            expect(pedido.usuarioid).toBeDefined();
            expect(pedido.productoid).toBeDefined();
            expect(pedido.fecha).toBeDefined();
            expect(pedido.total).toBeDefined();
            expect(pedido.usuario).toBeDefined();
            expect(pedido.usuario.usuarioid).toBeDefined();
            expect(pedido.usuario.nombre).toBeDefined();
            expect(pedido.usuario.email).toBeDefined();
            expect(pedido.producto).toBeDefined();
            expect(pedido.producto.productoid).toBeDefined();
            expect(pedido.producto.titulo).toBeDefined();
            expect(pedido.producto.descripcion).toBeDefined();
            expect(pedido.producto.precio).toBeDefined();
        });
    });

    test('GET /api/pedidos with Usuario rol', async () => {
        await api
            .get('/api/pedidos')
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .expect(401);
    });
    
    test('POST /api/pedidos register a list of pedidos', async () => {
        const pedidosList = {
            pedidos: [
                {
                    email: emailUsuario,
                    productoid: 1
                },
                {
                    email: emailUsuario,
                    productoid: 2
                }
            ]
        };

        const response = await api
            .post('/api/pedidos')
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(pedidosList)
            .expect(201);

        expect(Array.isArray(response.body)).toBe(true);
    });

    test('POST /api/pedidos with empty pedidos', async () => {
        const pedidosList = {
            pedidos: []
        };

        await api
            .post('/api/pedidos')
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(pedidosList)
            .expect(400);
    });
});

afterAll(() => {
    server.close();
});