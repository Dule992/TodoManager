import axios from 'axios';
const API = 'http://localhost:4000';

export const login = (data) => axios.post(`${API}/login`, data);
export const getTodos = () => axios.get(`${API}/todos`);
export const addTodo = (data) => axios.post(`${API}/todos`, data);
export const updateTodo = (id, data) => axios.put(`${API}/todos/${id}`, data);
export const deleteTodo = (id) => axios.delete(`${API}/todos/${id}`);