const { pedido, producto, usuario, Sequelize } = require('../models');
const { body, validationResult } = require('express-validator');
const Op = Sequelize.Op;

let self = {}

self.pedidoValidator = [
  body('pedidos').isArray({ min: 1 }).withMessage('Debe enviar una lista de pedidos.'),
  body('pedidos.*.email')
    .not()
    .isEmpty()
    .withMessage('El campo email es obligatorio.')
    .isLength({ max: 255 }),
  body('pedidos.*.productoid')
    .not()
    .isEmpty()
    .withMessage('El campo productoid es obligatorio.')
    .isNumeric()
]

//GET: api/pedidos
self.getAll = async function (req, res, next) {
  try {
    let data = await pedido.findAll({
      attributes: [['id', 'pedidoId'], 'usuarioid', 'productoid', 'fecha', 'total'],
      include: [
        {
          model: usuario,
          as: 'usuario',
          attributes: [['id', 'usuarioid'], 'nombre', 'email']
        },
        {
          model: producto,
          as: 'producto',
          attributes: [['id', 'productoid'], 'titulo', 'descripcion', 'precio']
        }
      ]
    })
    return res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}

self.create = async function (req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json(errors)
      return
    }

    const pedidos = req.body.pedidos
    if (!Array.isArray(pedidos)|| pedidos.length === 0)
      return res.status(400).send('Se requiere al menos un pedido')

    const resultados = []

    for (const itemPedido of pedidos) {
      var usuarioEncontrado = await usuario.findOne({ where: { email: itemPedido.email } });
      if (!usuarioEncontrado) {
        resultados.push({
          itemPedido: itemPedido,
          error: "Usuario no encontrado",
        });
        continue;
      }

      let productoEncontrado = await producto.findByPk(itemPedido.productoid);
      if (!productoEncontrado) {
        resultados.push({
          itemPedido: itemPedido,
          error: "Producto no encontrado",
        });
        continue;
      }
      
      let nuevoPedido = await pedido.create({
        email: itemPedido.email,
        usuarioid: usuarioEncontrado.id,
        productoid: itemPedido.productoid,
        total: productoEncontrado.precio,
        fecha: new Date(),
      });
      
      req.bitacora("Pedido.crear", nuevoPedido.id);

      resultados.push({
        pedido: nuevoPedido,
        error: null,
      });
    }
    res.status(201).json(resultados)
  } catch (error) {
    next(error)
  }
}

module.exports = self