const { carrito, producto } = require('../models');
const crypto = require('crypto');

let self = {};

self.get = async function (req, res, next) {
    try {
        const user = req.user; 

        const data = await carrito.findAll({
            where: { usuarioId: user.id },
            include: { model: producto }
        });

        res.status(200).json(data);
    } catch (e) {
        next(e);
    }
};

self.add = async function (req, res, next) {
    try {
        const user = req.user;

        const { productoId } = req.body;

        let item = await carrito.findOne({
            where: { usuarioId: user.id, productoId }
        });

        if (item) {
            item.cantidad += 1;
            await item.save();
        } else {
            await carrito.create({
                id: crypto.randomUUID(),
                usuarioId: user.id,
                productoId,
                cantidad: 1
            });
        }

        res.status(201).json({ msg: "Producto añadido al carrito" });
    } catch (e) {
        next(e);
    }
};

self.delete = async function (req, res, next) {
    try {
        const user = req.user;
        const { id } = req.params;

        await carrito.destroy({
            where: { usuarioId: user.id, id }
        });

        res.status(204).send();
    } catch (e) {
        next(e);
    }
};

module.exports = self;
