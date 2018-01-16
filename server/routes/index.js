const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const usersController = require('../controllers').users;
const verifyToken = require('../middlewares/verifyToken');

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
  }));

  app.post('/api/todos', todosController.create);
  app.get('/api/todos', verifyToken, todosController.list);  
  app.get('/api/todos/:todoId', todosController.retrieve);
  app.delete('/api/todos/:todoId', todosController.destroy);

  app.post('/api/todos/:todoId/items', todoItemsController.create);
  app.get('/api/todos/:todoId/items', todoItemsController.list);
  app.put('/api/todos/:todoId/items/:todoItemId', todoItemsController.update);
  app.delete('/api/todos/:todoId/items/:todoItemId', todoItemsController.destroy);

  app.post('/auth/register', usersController.create);
  app.get('/auth/login', usersController.login);
  app.get('/auth/logout', usersController.logout);
  app.get('/api/profile', verifyToken, usersController.retrieve);
  app.get('/api/authenticate', usersController.authenticate);


  // For any other request method on todo items, we're going to return "Method Not Allowed"
  app.all('/api/*', (req, res) =>
    res.status(405).send({
      message: 'Method Not Allowed',
  }));
};