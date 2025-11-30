const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const Authorize = require('../middlewares/auth.middleware');

// LOGIN
router.post('/', auth.loginValidator, auth.login);

// TIEMPO TOKEN
router.get('/tiempo', Authorize('Usuario,Administrador'), auth.tiempo);

// REGISTRO
router.post('/registro', auth.registroValidator, auth.registrar);

module.exports = router;
