import React, { useState, useEffect } from 'react';
import { login, getTodos, addTodo, updateTodo, deleteTodo } from './api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleLogin = async () => {
    try {
      const res = await login(credentials);
      if (res.data.success) {
        setIsLoggedIn(true);
        fetchTodos();
      }
    } catch (e) {
      alert('Login failed');
    }
  };

  const fetchTodos = async () => {
    const res = await getTodos();
    setTodos(res.data);
  };

  const handleAdd = async () => {
    if (!newTodo.trim()) return;
    const res = await addTodo({ title: newTodo, completed: false });
    setTodos([...todos, res.data]);
    setNewTodo('');
  };

  const handleUpdate = async (todo) => {
    const res = await updateTodo(todo.id, { completed: !todo.completed });
    setTodos(todos.map(t => (t.id === todo.id ? res.data : t)));
  };

  const handleDelete = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(t => t.id !== id));
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h2>Login</h2>
        <input placeholder="Username" onChange={e => setCredentials({ ...credentials, username: e.target.value })} />
        <input placeholder="Password" type="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Todos</h2>
      <input value={newTodo} onChange={e => setNewTodo(e.target.value)} placeholder="New todo" />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
            <button onClick={() => handleUpdate(todo)}>Toggle</button>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}