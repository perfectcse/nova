import { useState } from "react";
import api from "../service/api";
import "../styles/editTask.css";

function EditTask({ task, onTaskUpdated, onCancel }) {
  if (!task) {
    return null;
  }

  return (
    <EditTaskForm
      key={task._id}
      task={task}
      onTaskUpdated={onTaskUpdated}
      onCancel={onCancel}
    />
  );
}

function EditTaskForm({ task, onTaskUpdated, onCancel }) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "To Do");
  const [priority, setPriority] = useState(task.priority || "Medium");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!task?._id) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      await api.put(`/tasks/${task._id}`, {
        title,
        description,
        status,
        priority,
        dueDate: dueDate || undefined,
      });

      onTaskUpdated();
    } catch (error) {
      console.error("Update task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-task-overlay">
      <div className="edit-task-card">
        <div className="edit-task-header">
          <div>
            <h2>Edit Task</h2>
            <p>Update the task details.</p>
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
            <label htmlFor="edit-task-title">
              Task Title
            </label>

            <input
              id="edit-task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-description">
              Description
            </label>

            <textarea
              id="edit-task-description"
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
              <label htmlFor="edit-task-status">
                Status
              </label>

              <select
                id="edit-task-status"
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
              <label htmlFor="edit-task-priority">
                Priority
              </label>

              <select
                id="edit-task-priority"
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
            <label htmlFor="edit-task-due-date">
              Due Date
            </label>

            <input
              id="edit-task-due-date"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              disabled={loading}
            />
          </div>

          {error && (
            <p className="edit-task-error">
              {error}
            </p>
          )}

          <div className="edit-task-actions">
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;