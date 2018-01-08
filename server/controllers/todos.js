const Todo = require('../models').Todo;
const TodoItem = require('../models').TodoItem;

class Todo {
  constructor({models}) {
    if(!models) throw new Error('Models not provided!');
    this.models = models;
  }

  async create(req, res) {
    try {
      const todo = await Todo.create({
        title: req.body.title,
      });

      if (!todo) return Promise.reject(new errors.NotFound());
      return Promise.resolve(todo);
    } catch(error) {
      console.error(error);
    }
  }

}

module.exports = {
  create(req, res) {
    return Todo
      .create({
        title: req.body.title,
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Todo
      .findAndCountAll({
        include: [{ 
          model: TodoItem, as: 'todoItems' 
        }],
        limit: 10
      })
      .then(todos => res.status(200).send(todos))
      .catch(error => res.status(400).send(error));
  },
  retrieve(req, res) {
    return Todo
    .findById(req.params.todoId, {
      include: [{
        model: TodoItem,
        as: 'todoItems',
      }],
    })
    .then(todo => {
      if (!todo) {
        return res.status(404).send({
          message: 'Todo Not Found',
        });
      }
      return res.status(200).send(todo);
    })
    .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return Todo
      .findById(req.params.todoId)
      .then(todo => {
        if (!todo) {
          return res.status(400).send({
            message: 'Todo Not Found',
          });
        }
        return todo
          .destroy()
          .then(() => res.status(200).send({ message: 'Todo deleted successfully.' }))
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};