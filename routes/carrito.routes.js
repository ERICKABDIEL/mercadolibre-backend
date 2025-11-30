const router = require('express').Router();
const Carrito = require('../controllers/carrito.controller');
const Authorize = require('../middlewares/auth.middleware');

router.get('/', Authorize("Usuario,Administrador"), Carrito.get);
router.post('/', Authorize("Usuario,Administrador"), Carrito.add);
router.delete('/:id', Authorize("Usuario,Administrador"), Carrito.delete);

module.exports = router;
