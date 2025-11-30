const { usuario, rol} = require('../models')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let self = {}

self.clienteValidator = [
    body('email', 'El campo email es obligatorio').not().isEmpty().isLength({ max: 255 }),
    body('nombre', 'El campo nombre es obligatorio').not().isEmpty().isLength({ max: 255 }),
    body('password', 'El campo password es obligatorio').not().isEmpty().isLength({ max: 255 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,12}$/, 
            'i').withMessage('La contraseña debe tener al menos 8 caracteres, máximo 12 caracteres, una mayúscula, una minúscula, un número y un carácter especial.')
]

// POST: api/clientes
self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).json(errors)
            return
        }

       if (req.body.password !== req.body.confirmPassword) {
            return res.status(400).json({
                error: "La contraseña y la confirmación de la contraseña no coinciden."
            });
        }

        const existingUser = await usuario.findOne({ where: { email: req.body.email } });
        if(existingUser) {
            return res.status(400).json({
                error: "El correo electrónico ya está en uso. Ingrese uno diferente."
            });
        }

        const rolusuario = await rol.findOne({ where: { nombre: req.body.rol } })


        const data = await usuario.create({
            id: crypto.randomUUID(),
            email: req.body.email,
            passwordhash: await bcrypt.hash(req.body.password, 10),
            nombre: req.body.nombre,
            rolid: rolusuario.id
        })
        
        // Bitacora
        req.bitacora("usuarios.crear", data.email)
        res.status(201).json({
            id: data.id,
            email: data.email,
            nombre: data.nombre,
            rolid: rolusuario.nombre
        })
    } catch (error) {
        next(error)
    }
}


module.exports = self