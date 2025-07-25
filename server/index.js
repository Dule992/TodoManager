const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

let todos = [
  { id: 1, title: 'Learn Testing', completed: false },
  { id: 2, title: 'Write Code', completed: false },
];

const users = [{ username: 'test', password: '1234' }];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) return res.json({ success: true });
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const newTodo = { id: Date.now(), ...req.body };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex(todo => todo.id == id);
  if (index !== -1) {
    todos[index] = { ...todos[index], ...req.body };
    return res.json(todos[index]);
  }
  res.status(404).json({ message: 'Not found' });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  todos = todos.filter(todo => todo.id != id);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));