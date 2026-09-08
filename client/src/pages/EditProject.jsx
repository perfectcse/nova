import { useState } from "react";
import api from "../service/api";
import "../styles/editProject.css";

function EditProject({ project, onProjectUpdated, onCancel }) {
  if (!project) {
    return null;
  }

  return (
    <EditProjectForm
      key={project._id}
      project={project}
      onProjectUpdated={onProjectUpdated}
      onCancel={onCancel}
    />
  );
}

function EditProjectForm({ project, onProjectUpdated, onCancel }) {
  const [name, setName] = useState(project.name || "");
  const [description, setDescription] = useState(project.description || "");
  const [status, setStatus] = useState(project.status || "Planning");
  const [startDate, setStartDate] = useState(
    project.startDate
      ? new Date(project.startDate).toISOString().split("T")[0]
      : ""
  );
  const [dueDate, setDueDate] = useState(
    project.dueDate
      ? new Date(project.dueDate).toISOString().split("T")[0]
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!project?._id) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.put(
        `/projects/${project._id}`,
        {
          name,
          description,
          status,
          startDate: startDate || undefined,
          dueDate: dueDate || undefined,
        }
      );

      onProjectUpdated(response.data.project);
    } catch (error) {
      console.error("Update project error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-project-overlay">
      <div className="edit-project-card">
        <div className="edit-project-header">
          <div>
            <h2>Edit Project</h2>
            <p>Update your project details.</p>
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
            <label htmlFor="edit-project-name">
              Project Name
            </label>

            <input
              id="edit-project-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-project-description">
              Description
            </label>

            <textarea
              id="edit-project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-project-status">
              Status
            </label>

            <select
              id="edit-project-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              disabled={loading}
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="date-fields">
            <div className="form-group">
              <label htmlFor="edit-project-start-date">
                Start Date
              </label>

              <input
                id="edit-project-start-date"
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-project-due-date">
                Due Date
              </label>

              <input
                id="edit-project-due-date"
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
            <p className="edit-project-error">
              {error}
            </p>
          )}

          <div className="edit-project-actions">
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

export default EditProject;