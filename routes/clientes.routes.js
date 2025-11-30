const router = require('express').Router();
const clientes = require('../controllers/clientes.controller');

//POST: api/clientes
router.post('/', clientes.create);

module.exports = router;