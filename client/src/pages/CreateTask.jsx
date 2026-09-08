import { useState } from "react";
import api from "../service/api";
import "../styles/createTask.css";

function CreateTask({ projectId, onTaskCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("To Do");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/tasks", {
        title,
        description,
        status,
        priority,
        project: projectId,
        dueDate: dueDate || undefined,
      });

      onTaskCreated();
    } catch (error) {
      console.error("Create task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-task-overlay">
      <div className="create-task-card">
        <div className="create-task-header">
          <div>
            <h2>Create New Task</h2>
            <p>Add a task to this project.</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={onCancel}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-title">Task Title</label>

            <input
              id="task-title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              placeholder="Describe the task"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="task-select-fields">
            <div className="form-group">
              <label htmlFor="task-status">Status</label>

              <select
                id="task-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                disabled={loading}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
                disabled={loading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date">Due Date</label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              disabled={loading}
            />
          </div>

          {error && (
            <p className="create-task-error">
              {error}
            </p>
          )}

          <div className="create-task-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;