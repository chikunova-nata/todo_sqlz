'use strict';
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define('Todo', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  },
{
  hooks: {
    beforeCreate: async(instance, options) => {
      const lastTodo = await instance.sequelize.models.Todo.findOne({
        order: [['id', 'DESC'],]
      });

      instance.order = !lastTodo ? 1 : lastTodo.order + 1;
    }
  }
});

  Todo.associate = (models) => {
    Todo.hasMany(models.TodoItem, {
      foreignKey: 'todoId',
      as: 'todoItems',
    });
  };

  return Todo;
};