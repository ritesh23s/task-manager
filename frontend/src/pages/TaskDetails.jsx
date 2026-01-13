import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      alert("Task not found or access denied");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!task) return null;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task Details</h2>

      <div
        style={{
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          maxWidth: "500px",
        }}
      >
        <h3>{task.title}</h3>

        <p>
          <strong>Description:</strong> {task.description}
        </p>

        <p>
          <strong>Due Date:</strong>{" "}
          {task.dueDate ? task.dueDate.slice(0, 10) : "N/A"}
        </p>

        <p>
          <strong>Priority:</strong> {task.priority}
        </p>

        <p>
          <strong>Status:</strong> {task.status}
        </p>
      </div>

      <button
        style={{ marginTop: "15px" }}
        onClick={() => navigate("/")}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TaskDetails;
