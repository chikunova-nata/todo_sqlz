'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
    .addColumn(
      'Todos',
      'order',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    ),
  down: (queryInterface /* , Sequelize */) => queryInterface
  .dropTable('Todos')
  .removeColumn('order'),
};