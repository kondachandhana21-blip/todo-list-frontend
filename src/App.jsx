import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(response => {
        if (!response.ok) throw new Error('Failed to load tasks');
        return response.json();
      })
      .then(data => setTasks(data))
      .catch(error => console.error('Loading error:', error))
      .finally(() => setLoading(false));
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!taskInput.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskInput.trim(),
          completed: false
        })
      });

      if (!response.ok) throw new Error('Failed to add task');

      const newTask = await response.json();
      setTasks(previous => [...previous, newTask]);
      setTaskInput('');
    } catch (error) {
      console.error(error);
      alert('Could not add task. Please check that the backend is running.');
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          completed: !task.completed
        })
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();

      setTasks(previous =>
        previous.map(item =>
          item.id === updatedTask.id ? updatedTask : item
        )
      );
    } catch (error) {
      console.error(error);
      alert('Could not update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks(previous => previous.filter(task => task.id !== id));
    } catch (error) {
      console.error(error);
      alert('Could not delete task.');
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="app">
      <header className="header">
        <div className="logo">✓ TaskFlow</div>
        <span className="header-tag">MY PRODUCTIVITY</span>
      </header>

      <main className="container">
        <section className="welcome">
          <p className="eyebrow">YOUR PERSONAL TASK MANAGER</p>
          <h1>Make today <span>count.</span></h1>
          <p className="subtitle">
            Organize your tasks, focus on what matters, and get things done.
          </p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <h2>{tasks.length}</h2>
          </div>
          <div className="stat-card">
            <span>Completed</span>
            <h2>{completedCount}</h2>
          </div>
          <div className="stat-card">
            <span>Pending</span>
            <h2>{tasks.length - completedCount}</h2>
          </div>
        </section>

        <section className="task-section">
          <h2>My Tasks</h2>
          <p className="section-description">
            Add your tasks and track your progress.
          </p>

          <form className="task-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={taskInput}
              onChange={e => setTaskInput(e.target.value)}
              aria-label="New task"
            />
            <button type="submit">+ Add Task</button>
          </form>

          <div className="task-list">
            {loading ? (
              <p>Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3>No tasks yet</h3>
                <p>Add your first task and start being productive!</p>
              </div>
            ) : (
              tasks.map(task => (
                <div className="task-item" key={task.id}>
                  <label className="task-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task)}
                    />
                    <span className={task.completed ? 'completed' : ''}>
                      {task.title}
                    </span>
                  </label>
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <footer>
          <p>Stay focused. Keep moving forward. ✨</p>
        </footer>
      </main>
    </div>
  );
}

export default App;