const colors = {
  Low: "green",
  Medium: "orange",
  High: "red",
};

const TaskList = ({ tasks, onEdit, onDelete, onToggle }) => {
  return (
    <div>
      {tasks.map((task, index) => (
        <div
          key={task._id}
          className="card"
          style={{ marginBottom: "15px", maxWidth: "100%" }}
        >
          <h4>
            {index + 1}. Name: {task.title}
          </h4>

          <p>
            <strong>Description:</strong> {task.description}
          </p>

          <p>
            <strong>Due Date:</strong>{" "}
            {task.dueDate ? task.dueDate.slice(0, 10) : "N/A"}
          </p>

          <p
            style={{
              fontWeight: task.status === "completed" ? "600" : "400",
              color: task.status === "completed" ? "green" : "inherit",
            }}
          >
            <strong>Status:</strong> {task.status}
          </p>


          <p>
            <strong>Priority:</strong>{" "}
            <span style={{ color: colors[task.priority] }}>
              {task.priority}
            </span>
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{ width: "auto" }}
              onClick={() => onToggle(task)}
            >
              {task.status === "pending"
                ? "Mark Complete"
                : "Mark Pending"}
            </button>

            <button
              style={{ width: "auto" }}
              onClick={() => onEdit(task)}
            >
              Edit
            </button>

            <button
              style={{ width: "auto", background: "crimson" }}
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
