const { usuario, rol, Sequelize } = require('../models');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

let self = {};

// ==========================
// VALIDACIONES
// ==========================
self.usuarioValidator = [
    body('email', 'El campo email es obligatorio')
        .not().isEmpty()
        .isEmail()
        .isLength({ max: 255 }),

    body('nombre', 'El campo nombre es obligatorio')
        .not().isEmpty()
        .isLength({ max: 255 }),

    body('password')
        .not()
        .isEmpty()
        .withMessage('El campo password es obligatorio')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,12}$/)
        .withMessage(
            'La contraseña debe tener entre 8 y 12 caracteres, incluir una mayúscula, una minúscula, un número y un carácter especial.'
        )
];

self.usuarioPutValidator = [
    body('nombre', 'El campo nombre es obligatorio')
        .not().isEmpty()
        .isLength({ max: 255 }),

    body('rol', 'El campo rol es obligatorio')
        .not().isEmpty()
        .isLength({ max: 255 }),
];

// ==========================
// GET: api/usuarios
// ==========================
self.getAll = async function (req, res, next) {
    try {
        const data = await usuario.findAll({
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        });
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ==========================
// GET: api/usuarios/email
// ==========================
self.get = async function (req, res, next) {
    try {
        const email = req.params.email;
        const data = await usuario.findOne({
            where: { email },
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        });

        if (!data) return res.status(404).send();

        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};

// ==========================
// POST: api/usuarios (ADMIN)
// ==========================
self.create = async function (req, res, next) {
    try {
        console.log("=== CREATE USER ===");
        console.log("Body recibido:", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const mensajes = errors.array().map(err => err.msg);
            return res.status(400).json({ error: true, mensajes });
        }

        // BÚSQUEDA INSENSIBLE A MAYÚSCULAS
        const rolusuario = await rol.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('nombre')),
                req.body.rol.toLowerCase()
            )
        });

        if (!rolusuario) {
            return res.status(400).json({
                error: true,
                mensajes: ["El rol seleccionado no existe."]
            });
        }

        const data = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolusuario.id
        });

        req.bitacora("usuarios.crear", data.email);

        res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rolid: rolusuario.id
        });

    } catch (error) {
        console.error("ERROR EN CREATE:", error);
        next(error);
    }
};

// ==========================
// PUT: api/usuarios/email
// ==========================
self.update = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const mensajes = errors.array().map(err => err.msg);
            return res.status(400).json({ error: true, mensajes });
        }

        const email = req.params.email;

        // Buscar rol CASE-INSENSITIVE
        const rolusuario = await rol.findOne({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('nombre')),
                req.body.rol.toLowerCase()
            )
        });

        if (!rolusuario) {
            return res.status(400).json({
                error: true,
                mensajes: ["El rol seleccionado no existe."]
            });
        }

        req.body.rolid = rolusuario.id;

        const result = await usuario.update(req.body, { where: { email } });
        if (result[0] === 0) return res.status(404).send();

        req.bitacora("usuarios.editar", email);
        res.status(204).send();

    } catch (error) {
        next(error);
    }
};

// ==========================
// DELETE
// ==========================
self.delete = async function (req, res, next) {
    try {
        const email = req.params.email;
        let data = await usuario.findOne({ where: { email } });

        if (!data) return res.status(404).send();
        if (data.protegido) return res.status(403).send();

        const deleted = await usuario.destroy({ where: { email } });

        if (deleted === 1) {
            req.bitacora("usuarios.eliminar", email);
            return res.status(204).send();
        }

        res.status(403).send();
    } catch (error) {
        next(error);
    }
};

module.exports = self;
