import axios from 'axios';

const API = 'http://localhost:4000';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface Credentials {
  username: string;
  password: string;
}

export const login = (data: Credentials) => axios.post(`${API}/login`, data);
export const getTodos = () => axios.get<Todo[]>(`${API}/todos`);
export const addTodo = (data: Omit<Todo, 'id'>) => axios.post<Todo>(`${API}/todos`, data);
export const updateTodo = (id: number, data: Partial<Todo>) => axios.put<Todo>(`${API}/todos/${id}`, data);
export const deleteTodo = (id: number) => axios.delete(`${API}/todos/${id}`);