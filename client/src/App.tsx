import { useState, type ChangeEvent } from "react";
import {
  login,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  type Todo,
  type Credentials,
} from "./api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const handleLogin = async () => {
    try {
      const res = await login(credentials);
      if (res.data.success) {
        setIsLoggedIn(true);
        fetchTodos();
      }
    } catch (e) {
      console.error("Login failed:", e);
      // Optionally, you can show an alert or a message to the user
      setLoginError("Login failed");
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
    setNewTodo("");
  };

  const handleUpdate = async (todo: Todo) => {
    const res = await updateTodo(todo.id, { completed: !todo.completed });
    setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
  };

  const handleDelete = async (id: number) => {
    await deleteTodo(id);
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleEditSave = async (todo: Todo) => {
    const res = await updateTodo(todo.id, { title: editingText });
    setTodos(todos.map((t) => (t.id === todo.id ? res.data : t)));
    setEditingId(null);
    setEditingText("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setLoginError(null); // clear error as user edits input
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h2>Login</h2>
        <input
          name="username"
          placeholder="Username"
          onChange={handleInputChange}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleInputChange}
        />
        <button onClick={handleLogin}>Login</button>

        {/* Show error if login failed */}
        {loginError && (
          <div>
            <p style={{ color: "red" }}>{loginError}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2>Todos</h2>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editingId === todo.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleEditSave(todo)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.title}
                </span>
                <button onClick={() => handleUpdate(todo)}>Toggle</button>
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditingText(todo.title);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
