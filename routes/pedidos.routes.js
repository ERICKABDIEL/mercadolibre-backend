const router = require('express').Router();
const pedidos = require('../controllers/pedidos.controller');
const Authorize = require('../middlewares/auth.middleware');

//GET: api/pedidos
router.get('/', Authorize('Administrador'), pedidos.getAll);

//POST: api/pedidos
router.post('/', Authorize('Usuario'), pedidos.pedidoValidator, pedidos.create);

module.exports = router;