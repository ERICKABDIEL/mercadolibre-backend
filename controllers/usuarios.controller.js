const { usuario, rol, Sequelize } = require('../models')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

let self = {}

self.usuarioValidator = [
    body('email', 'El campo email es obligatorio').not().isEmpty().isLength({ max: 255 }),
    body('nombre', 'El campo nombre es obligatorio').not().isEmpty().isLength({ max: 255 }),
    body('password', 'El campo password es obligatorio').not().isEmpty().isLength({ max: 255 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,12}$/, 
            'i').withMessage('La contraseña debe tener al menos 8 caracteres, máximo 12 caracteres, una mayúscula, una minúscula, un número y un carácter especial.')
]

self.usuarioPutValidator = [
    body('nombre', 'El campo nombre es obligatorio').not().isEmpty().isLength({ max: 255 }),
    body('rol', 'El campo rol es obligatorio').not().isEmpty().isLength({ max: 255 }),
]

//GET: api/usuarios
self.getAll = async function (req, res, next) {
    try{
        const data = await usuario.findAll({
            raw: true,
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: {model: rol, attributes: []}
        })
        res.status(200).json(data)
    } catch (error){
        next(error)
    }
}

//GET: api/usuarios/email
self.get = async function (req, res, next) {
    try{
        const email = req.params.email
        const data = await usuario.findOne({
            where: { email: email}, 
            raw: true, 
            attributes: ['id', 'email', 'nombre', [Sequelize.col('rol.nombre'), 'rol']],
            include: { model: rol, attributes: []}
        })
        if (data)
            return res.status(200).json(data)
        res.status(404).send()
    } catch(error) {
        next(error)
    }
}

// POST: api/usuarios
self.create = async function (req, res, next) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).json(errors)
            return
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

//PUT: api/usuarios/email
self.update = async function (req, res, next) {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            res.status(400).json(errors)
            return
        }

        const email = req.params.email
        const rolusuario = await rol.findOne({where: { nombre: req.body.rol}})
        req.body.rolid = rolusuario.id

        const data = await usuario.update(req.body, {
            where: {email: email}, 
        })
        if (data[0] === 0)
            return res.status(404).send()
        //Bitacora
        req.bitacora("usuarios.editar", email)
        res.status(204).send()
    } catch (error){
        next(error)
    }
}

//DELETE: api/usuarios/email
self.delete = async function (req, res, next) {
    try{
        const email = req.params.email
        let data = await usuario.findOne({where: { email: email}})
        //No se pueden eliminar usuarios protegidos
        if (data.protegido) return res.status(403).send()

        data = await usuario.destroy({ where: { email: email }})
        if (data === 1){
            ///Bitacora
            req.bitacora("usuarios.eliminar", email)
            return res.status(204).send() //Elemento eliminad
        }

        res.status(403).send()
    } catch (error){
        next(error)
    }
}

module.exports = self