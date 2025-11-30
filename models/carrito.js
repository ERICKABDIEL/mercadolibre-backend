'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class carrito extends Model {
    static associate(models) {
      carrito.belongsTo(models.usuario, { foreignKey: 'usuarioId' });
      carrito.belongsTo(models.producto, { foreignKey: 'productoId' });
    }
  }

  carrito.init({
    id: { type: DataTypes.STRING, primaryKey: true },
    usuarioId: { type: DataTypes.STRING, allowNull: false },
    productoId: { type: DataTypes.STRING, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, defaultValue: 1 }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'carrito'
  });

  return carrito;
};
