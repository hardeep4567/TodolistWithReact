import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "professional-todos";

function readTasks() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || localStorage.getItem("local") || "[]"
    );
    return Array.isArray(saved)
      ? saved.map((task, index) =>
          typeof task === "string"
            ? { id: `${Date.now()}-${index}`, text: task, completed: false }
            : task
        )
      : [];
  } catch {
    return [];
  }
}

function Icon({ name }) {
  const paths = {
    edit: <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v5M14 11v5" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function TodoLister() {
  const [tasks, setTasks] = useState(readTasks);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.removeItem("local");
  }, [tasks]);

  const remaining = tasks.filter((task) => !task.completed).length;
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  }), [tasks, filter]);

  function submitTask(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;

    if (editingId) {
      setTasks((current) => current.map((task) => task.id === editingId ? { ...task, text } : task));
    } else {
      setTasks((current) => [...current, { id: crypto.randomUUID(), text, completed: false }]);
    }
    cancelEdit();
  }

  function startEdit(task) {
    setEditingId(task.id);
    setInput(task.text);
  }

  function cancelEdit() {
    setEditingId(null);
    setInput("");
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, completed: !task.completed } : task));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    if (editingId === id) cancelEdit();
  }

  return (
    <main className="todo-page">
      <section className="todo-card" aria-labelledby="todo-title">
        <header className="todo-header">
          <div className="brand-mark"><Icon name="check" /></div>
          <div>
            <p className="eyebrow">My workspace</p>
            <h1 id="todo-title">Today’s tasks</h1>
            <p className="subtitle">Keep your day focused and your mind clear.</p>
          </div>
        </header>

        <form className="task-form" onSubmit={submitTask}>
          <label className="sr-only" htmlFor="task-input">Task name</label>
          <input id="task-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder={editingId ? "Update your task…" : "What needs to be done?"} autoComplete="off" />
          {editingId && <button className="cancel-button" type="button" onClick={cancelEdit} aria-label="Cancel editing"><Icon name="close" /></button>}
          <button className="add-button" type="submit" disabled={!input.trim()}><Icon name={editingId ? "check" : "plus"} /><span>{editingId ? "Save" : "Add task"}</span></button>
        </form>

        <div className="task-toolbar">
          <div className="filters" aria-label="Filter tasks">
            {["all", "active", "completed"].map((name) => <button key={name} type="button" className={filter === name ? "active" : ""} onClick={() => setFilter(name)}>{name}</button>)}
          </div>
          <span className="task-count">{remaining} {remaining === 1 ? "task" : "tasks"} left</span>
        </div>

        <div className="task-list">
          {visibleTasks.length ? visibleTasks.map((task) => (
            <article className={`task-item ${task.completed ? "is-complete" : ""}`} key={task.id}>
              <button className="check-button" type="button" onClick={() => toggleTask(task.id)} aria-label={task.completed ? `Mark ${task.text} active` : `Complete ${task.text}`}><Icon name="check" /></button>
              <span className="task-text">{task.text}</span>
              <div className="task-actions">
                <button type="button" onClick={() => startEdit(task)} aria-label={`Edit ${task.text}`}><Icon name="edit" /></button>
                <button className="delete-button" type="button" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.text}`}><Icon name="trash" /></button>
              </div>
            </article>
          )) : (
            <div className="empty-state">
              <div className="empty-icon"><Icon name="check" /></div>
              <h2>{tasks.length ? "Nothing here" : "Your list is clear"}</h2>
              <p>{tasks.length ? "Try another filter to see your tasks." : "Add a task above and make today count."}</p>
            </div>
          )}
        </div>

        {tasks.some((task) => task.completed) && <button className="clear-button" type="button" onClick={() => setTasks((current) => current.filter((task) => !task.completed))}>Clear completed</button>}
      </section>
      <p className="page-note">Small steps, meaningful progress.</p>
    </main>
  );
}
