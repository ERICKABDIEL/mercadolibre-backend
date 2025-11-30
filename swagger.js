const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        title: 'Mercado Libre Backend Node.js API',
        description: 'Esta es una API en node.js para el backend de una tiene de e-commerce',
    },
    host: 'localhost:3000'
}

const outputFile = './swagger-output.json'
const routes = ['./index.js']

swaggerAutogen(outputFile, routes, doc)