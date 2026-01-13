import { useEffect, useState } from "react";
import API from "../services/api";

const TaskForm = ({ fetchTasks, editTask, setEditTask }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });

  useEffect(() => {
    if (editTask) setForm(editTask);
  }, [editTask]);

  const submit = async (e) => {
    e.preventDefault();

    if (editTask) {
      await API.put(`/tasks/${editTask._id}`, form);
      setEditTask(null);
    } else {
      await API.post("/tasks", form);
    }

    setForm({ title: "", description: "", dueDate: "", priority: "Low" });
    fetchTasks();
  };

  // DATE LIMITS (UI CONTROL)
  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(
    new Date().setFullYear(new Date().getFullYear() + 5)
  )
    .toISOString()
    .split("T")[0];

  return (
    <form onSubmit={submit}>
      <input
        placeholder="Task Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />

      <input
        placeholder="Task Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      {/* LABEL FOR DATE (placeholder alternative) */}
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 13}}>
          Due Date:
        </label>

        <input
          type="date"
          value={form.dueDate}
          min={today}
          max={maxDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          required
        />
      </div>

      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>

      <button>{editTask ? "Update Task" : "Add Task"}</button>
    </form>
  );
};

export default TaskForm;
