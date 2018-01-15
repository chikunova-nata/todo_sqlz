module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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

    return User;
}