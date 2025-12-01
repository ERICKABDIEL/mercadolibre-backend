const bcrpt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { usuario, rol, Sequelize } = require('../models');
const { GeneraToken, TiempoRestanteToken } = require('../services/jwttoken.service');

let self = {}

self.loginValidator = [
    body('email', 'El campo email es obligatorio').not().isEmpty().isLength({ max: 255 }),
    body('password', 'El campo password es obligatorio').not().isEmpty().isLength({ max: 255 })
]

//POST: api/auth
self.login = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json(errors)
        return
    }

    const { email, password } = req.body;

    try {
        let data = await usuario.findOne({
            where: { email: email },
            raw: true,
            attributes: ['id', 'email', 'nombre', 'passwordhash', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: [] }
        })

        if (data === null)
            return res.status(404).json({ message: 'Usuario o contraseña incorrectos' })

        const passwordMatch = await bcrpt.compare(password, data.passwordhash)
        if (!passwordMatch) {
            return res.status(404).json({ message: 'Usuario o contraseña incorrectos' })
        }

        token = GeneraToken(data.email, data.nombre, data.rol)

        req.bitacora("usuario.login", data.email)

        res.status(200).json({
            email: data.email,
            nombre: data.nombre,
            rol: data.rol,
            jwt: token
        })
    } catch (error) {
        next(error)
    }
}

//GET: api/auth/tiempo
self.tiempo = async function (req, res){
    const tiempo = TiempoRestanteToken(req)
    if(tiempo === null)
        res.status(404).send()
    res.status(200).send(tiempo)
}

module.exports = self;