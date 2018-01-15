'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('Users', {
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }
    })
  },

  down: (queryInterface, Sequelize) => queryInterface
    .dropTable('Users')
};
