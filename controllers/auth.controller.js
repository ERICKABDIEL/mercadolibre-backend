const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { usuario, rol, Sequelize } = require('../models');
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service');

let self = {};

/* ===========================
   VALIDADORES
=========================== */

// LOGIN
self.loginValidator = [
    body('email', 'El campo email es obligatorio')
        .not().isEmpty()
        .isEmail()
        .isLength({ max: 255 }),
    body('password', 'El campo password es obligatorio')
        .not().isEmpty()
        .isLength({ max: 255 })
];

// REGISTRO
self.registroValidator = [
    body('email', 'Email obligatorio').not().isEmpty().isEmail(),
    body('password')
        .not().isEmpty()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,12}$/)
        .withMessage('La contraseña debe tener 8-12 caracteres, incluir mayúsculas, minúsculas, números y símbolos.'),
    body('nombre', 'El nombre es obligatorio').not().isEmpty()
];

/* ===========================
   LOGIN
=========================== */
self.login = async function (req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors);

    const { email, password } = req.body;

    try {
        const data = await usuario.findOne({
            where: { email },
            raw: true,
            attributes: [
                'id',
                'email',
                'nombre',
                'passwordhash',
                [Sequelize.col('rol.nombre'), 'rol']
            ],
            include: { model: rol, attributes: [] }
        });

        if (!data) {
            return res.status(404).json({ message: "Usuario o contraseña incorrectos" });
        }

        const passwordMatch = await bcrypt.compare(password, data.passwordhash);
        if (!passwordMatch) {
            return res.status(404).json({ message: "Usuario o contraseña incorrectos" });
        }

        const token = GeneraToken(data.email, data.nombre, data.rol);
        req.bitacora("usuario.login", data.email);

        return res.status(200).json({
            email: data.email,
            nombre: data.nombre,
            rol: data.rol,
            jwt: token
        });

    } catch (error) {
        next(error);
    }
};

/* ===========================
   TIEMPO TOKEN
=========================== */
self.tiempo = async function (req, res) {
    const tiempo = TiempoRestanteToken(req);
    if (tiempo === null)
        return res.status(404).send();
    res.status(200).send(tiempo);
};

/* ===========================
   REGISTRO (PÚBLICO)
=========================== */
self.registrar = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }

        // Buscar rol “usuario” insensible a mayúsculas
        const rolUsuario = await rol.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('nombre')),
                'usuario'
            )
        });

        if (!rolUsuario) {
            return res.status(500).json({ error: "Rol 'Usuario' no existe" });
        }

        const nuevo = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolUsuario.id
        });

        return res.status(201).json({
            email: nuevo.email,
            nombre: nuevo.nombre,
            rol: "Usuario"
        });

    } catch (error) {
        next(error);
    }
};

module.exports = self;
