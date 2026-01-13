import { useEffect, useState } from "react";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const UserDashboard = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = async () => {
    const params = new URLSearchParams({
      page,
    });

    if (statusFilter) params.append("status", statusFilter);
    if (priorityFilter) params.append("priority", priorityFilter);

    const res = await API.get(`/tasks?${params.toString()}`);

    setTasks(res.data.tasks);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    await API.put(`/tasks/${task._id}`, {
      status: task.status === "pending" ? "completed" : "pending",
    });
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  
  return (
    <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2>User Dashboard</h2>
        <button onClick={logout} style={{ width: "auto" }}>
          Logout
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        {/* ADD / EDIT TASK */}
        <div className="card" style={{ flex: 1 }}>
          <h3>Add / Edit Task</h3>
          <TaskForm
            fetchTasks={fetchTasks}
            editTask={editTask}
            setEditTask={setEditTask}
          />
        </div>

        {/* FILTER CARD */}
        <div className="card" style={{ width: "260px" }}>
          <h3>Filter Tasks</h3>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button
            className="primary-btn"
            onClick={() => {
              setPage(1);
              fetchTasks();
            }}
          >
            Apply Filter
          </button>


        </div>

      </div>

      <div>
        <TaskList
          tasks={tasks}
          onEdit={setEditTask}
          onDelete={deleteTask}
          onToggle={toggleStatus}
        />

      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          style={{ width: "auto", marginRight: "10px" }}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          style={{ width: "auto", marginLeft: "10px" }}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
