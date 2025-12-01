const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: ['http://localhost:8080'],
  methods: "GET, PUT, POST, DELETE",
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === 'development') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerFile = require('./swagger-output.json');
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));
}

app.use(require("./middlewares/bitacora.middleware"));
app.use(require("./middlewares/syntax.middleware"));

app.use("/api/categorias", require('./routes/categorias.routes'));
app.use("/api/productos", require('./routes/productos.routes'));
app.use("/api/usuarios", require('./routes/usuarios.routes'));
app.use("/api/clientes", require('./routes/clientes.routes'));
app.use("/api/roles", require('./routes/roles.routes'));
app.use("/api/auth", require('./routes/auth.routes'));
app.use("/api/archivos", require('./routes/archivos.routes'));
app.use("/api/bitacora", require('./routes/bitacora.routes'));
app.use("/api/pedidos", require('./routes/pedidos.routes'));

app.get('*', (req, res) => {
  res.status(404).send("Recurso no encontrado");
});

const errorhandler = require('./middlewares/errorhandler.middleware');
app.use(errorhandler);

let server = null;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(process.env.SERVER_PORT, () => {
    console.log(`Aplicación escuchando en el puerto ${process.env.SERVER_PORT}`);
  });
}

module.exports = { app, server };
