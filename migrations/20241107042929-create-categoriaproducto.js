'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('categoriaproducto', {
      categoriaid: {
        alowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'categoria',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productoid: {
        alowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'producto',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        alowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        alowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('categoriaproducto');
  }
};
