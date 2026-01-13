import { useEffect, useState } from "react";
import API from "../services/api";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const fetchUsers = async () => {
    const res = await API.get("/tasks/admin/users");
    setUsers(res.data);
  };

  const fetchAnalytics = async () => {
    const res = await API.get("/tasks/admin/analytics");
    setAnalytics(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  const toggleUser = async (id) => {
    await API.put(`/auth/admin/user/${id}/toggle`);
    fetchUsers();
    fetchAnalytics();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;
    await API.delete(`/auth/admin/user/${id}`);
    fetchUsers();
    fetchAnalytics();
  };

  const toggleTask = async (task) => {
    await API.put(`/tasks/admin/task/${task._id}`, {
      status: task.status === "pending" ? "completed" : "pending",
    });
    fetchUsers();
    fetchAnalytics();
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;
    await API.delete(`/tasks/admin/task/${id}`);
    fetchUsers();
    fetchAnalytics();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2>Admin Dashboard</h2>
      <p style={{ color: "red", fontWeight: "bold" }}>Logged in as ADMIN</p>
      <button onClick={logout} style={{ width: "auto", marginBottom: 20 }}>
        Logout
      </button>

      {/* ANALYTICS */}
      {analytics && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 15,
            marginBottom: 30,
          }}
        >
          <div className="card"><h4>Total Users</h4><strong>{analytics.users.total}</strong></div>
          <div className="card"><h4>Active Users</h4><strong style={{ color: "green" }}>{analytics.users.active}</strong></div>
          <div className="card"><h4>Disabled Users</h4><strong style={{ color: "crimson" }}>{analytics.users.disabled}</strong></div>
          <div className="card"><h4>Total Tasks</h4><strong>{analytics.tasks.total}</strong></div>
          <div className="card"><h4>Completed Tasks</h4><strong style={{ color: "green" }}>{analytics.tasks.completed}</strong></div>
          <div className="card"><h4>Pending Tasks</h4><strong style={{ color: "orange" }}>{analytics.tasks.pending}</strong></div>
        </div>
      )}

      {/* USERS */}
      {users.map((u) => (
        <div key={u._id} className="card" style={{ marginBottom: 20 }}>
          <h4>{u.name} ({u.email})</h4>
          <p>Status: {u.isActive ? "Active" : "Disabled"}</p>

          <button onClick={() => toggleUser(u._id)} style={{ width: "auto", marginRight: 8 }}>
            {u.isActive ? "Disable" : "Enable"}
          </button>

          <button onClick={() => deleteUser(u._id)} style={{ width: "auto", background: "crimson" }}>
            Delete User
          </button>

          <hr />

          {(expanded === u._id ? u.tasks : u.tasks.slice(0, 2)).map((t) => (
            <div key={t._id} style={{ borderLeft: "4px solid #888", paddingLeft: 10, marginBottom: 8 }}>
              <strong>{t.title}</strong>
              <p>Status: {t.status}</p>

              <button onClick={() => toggleTask(t)} style={{ width: "auto", marginRight: 6 }}>
                Toggle Status
              </button>

              <button onClick={() => deleteTask(t._id)} style={{ width: "auto", background: "crimson" }}>
                Delete
              </button>
            </div>
          ))}

          {u.tasks.length > 2 && (
            <button
              style={{ width: "auto", marginTop: 5 }}
              onClick={() => setExpanded(expanded === u._id ? null : u._id)}
            >
              {expanded === u._id ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
