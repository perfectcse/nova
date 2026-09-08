import { useState } from "react";
import api from "../service/api";
import "../styles/createProject.css";

function CreateProject({ onProjectCreated, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Planning");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/projects", {
        name,
        description,
        status,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
      });

      onProjectCreated();
    } catch (error) {
      console.error("Create project error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-project-overlay">
      <div className="create-project-card">
        <div className="create-project-header">
          <div>
            <h2>Create New Project</h2>
            <p>Set up a project for your team.</p>
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
            <label htmlFor="project-name">Project Name</label>

            <input
              id="project-name"
              type="text"
              placeholder="Enter project name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-description">
              Description
            </label>

            <textarea
              id="project-description"
              placeholder="Describe your project"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-status">Status</label>

            <select
              id="project-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={loading}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="date-fields">
            <div className="form-group">
              <label htmlFor="start-date">Start Date</label>

              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="due-date">Due Date</label>

              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <p
              style={{
                color: "#dc2626",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {error}
            </p>
          )}

          <div className="create-project-actions">
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
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProject;