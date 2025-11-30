'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pedido extends Model {
    static associate(models) {
      pedido.belongsTo(models.usuario);
      pedido.belongsTo(models.producto);
    }
  }
  pedido.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usuarioid:{
      type: DataTypes.STRING,
      allowNull: false
    },
    productoid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    freezeTableName: true,
    modelName: 'pedido',
  });

  return pedido;
};