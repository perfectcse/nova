import { useCallback, useEffect, useState } from "react";
import api from "../service/api";
import CreateTask from "./CreateTask";
import EditTask from "./EditTask";
import AddMember from "./AddMember";
import "../styles/projectDetails.css";

function ProjectDetails({ project, onBack }) {
  const [activeTab, setActiveTab] = useState("tasks");

  // Tasks
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [taskError, setTaskError] = useState("");

  const [showCreateTask, setShowCreateTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  // Team Members
  const [showAddMember, setShowAddMember] = useState(false);
  const [members, setMembers] = useState(project?.members || []);
  const [memberError, setMemberError] = useState("");
  const [removingMemberId, setRemovingMemberId] = useState(null);

  // Fetch project tasks
  const fetchTasks = useCallback(async () => {
    if (!project?._id) {
      return;
    }

    try {
      setLoadingTasks(true);
      setTaskError("");

      const response = await api.get(
        `/tasks/project/${project._id}`
      );

      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);

      setTaskError(
        error.response?.data?.message ||
          "Failed to load tasks."
      );
    } finally {
      setLoadingTasks(false);
    }
  }, [project]);

  // Load tasks whenever project changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTasks();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchTasks]);

  // Task created
  const handleTaskCreated = () => {
    setShowCreateTask(false);
    fetchTasks();
  };

  // Task updated
  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks();
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTaskId(taskId);
      setTaskError("");

      await api.delete(`/tasks/${taskId}`);

      await fetchTasks();
    } catch (error) {
      console.error("Delete task error:", error);

      setTaskError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Refresh members after adding a member
  const handleMemberAdded = async () => {
    setShowAddMember(false);
    setMemberError("");

    try {
      const response = await api.get(
        `/projects/${project._id}`
      );

      setMembers(response.data.project.members || []);
    } catch (error) {
      console.error("Refresh members error:", error);

      setMemberError(
        error.response?.data?.message ||
          "Member was added, but the member list could not be refreshed."
      );
    }
  };

  // Remove member
  const handleRemoveMember = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member from the project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingMemberId(userId);
      setMemberError("");

      await api.delete(
        `/projects/${project._id}/members/${userId}`
      );

      setMembers((currentMembers) =>
        currentMembers.filter(
          (member) => member._id !== userId
        )
      );
    } catch (error) {
      console.error("Remove member error:", error);

      setMemberError(
        error.response?.data?.message ||
          "Failed to remove member."
      );
    } finally {
      setRemovingMemberId(null);
    }
  };

  if (!project) {
    return (
      <div className="project-details-page">
        <div className="project-details-empty">
          <h2>Project not found</h2>

          <button onClick={onBack}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      {/* Header */}
      <header className="project-details-header">
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <div className="project-details-title">
          <div>
            <h1>{project.name}</h1>

            <p>
              {project.description ||
                "No description provided."}
            </p>
          </div>

          <span className="project-details-status">
            {project.status}
          </span>
        </div>
      </header>

      <main className="project-details-content">
        {/* Project Summary */}
        <section className="project-info-grid">
          <div className="project-info-card">
            <span>Start Date</span>

            <strong>
              {project.startDate
                ? new Date(
                    project.startDate
                  ).toLocaleDateString()
                : "Not set"}
            </strong>
          </div>

          <div className="project-info-card">
            <span>Due Date</span>

            <strong>
              {project.dueDate
                ? new Date(
                    project.dueDate
                  ).toLocaleDateString()
                : "Not set"}
            </strong>
          </div>

          <div className="project-info-card">
            <span>Team Members</span>

            <strong>{members.length}</strong>
          </div>

          <div className="project-info-card">
            <span>Tasks</span>

            <strong>{tasks.length}</strong>
          </div>
        </section>

        {/* Workspace */}
        <section className="project-workspace">
          {/* Tabs */}
          <div className="project-tabs">
            <button
              className={
                activeTab === "tasks"
                  ? "project-tab active"
                  : "project-tab"
              }
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>

            <button
              className={
                activeTab === "team"
                  ? "project-tab active"
                  : "project-tab"
              }
              onClick={() => setActiveTab("team")}
            >
              Team
            </button>

            <button
              className={
                activeTab === "overview"
                  ? "project-tab active"
                  : "project-tab"
              }
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
          </div>

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <div className="project-tab-content">
              <div className="project-section-header">
                <div>
                  <h2>Tasks</h2>

                  <p>
                    Manage tasks for this project.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowCreateTask(true)}
                >
                  + New Task
                </button>
              </div>

              {loadingTasks ? (
                <div className="project-empty-state">
                  <h3>Loading tasks...</h3>

                  <p>
                    Please wait while tasks are loaded.
                  </p>
                </div>
              ) : taskError ? (
                <div className="project-empty-state">
                  <h3>Unable to load tasks</h3>

                  <p>{taskError}</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="project-empty-state">
                  <h3>No tasks yet</h3>

                  <p>
                    Create your first task for this project.
                  </p>
                </div>
              ) : (
                <div className="tasks-list">
                  {tasks.map((task) => (
                    <div
                      className="task-card"
                      key={task._id}
                    >
                      <div className="task-card-header">
                        <h3>{task.title}</h3>

                        <span className="task-status">
                          {task.status}
                        </span>
                      </div>

                      <p>
                        {task.description ||
                          "No description provided."}
                      </p>

                      <div className="task-card-meta">
                        <span>
                          Priority: {task.priority}
                        </span>

                        <span>
                          {task.dueDate
                            ? `Due: ${new Date(
                                task.dueDate
                              ).toLocaleDateString()}`
                            : "No due date"}
                        </span>
                      </div>

                      <div className="task-card-actions">
                        <button
                          className="secondary-button"
                          onClick={() =>
                            setEditingTask(task)
                          }
                          disabled={
                            deletingTaskId === task._id
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteTask(task._id)
                          }
                          disabled={
                            deletingTaskId === task._id
                          }
                        >
                          {deletingTaskId === task._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === "team" && (
            <div className="project-tab-content">
              <div className="project-section-header">
                <div>
                  <h2>Team Members</h2>

                  <p>
                    People working on this project.
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowAddMember(true)}
                >
                  + Add Member
                </button>
              </div>

              {memberError && (
                <p className="member-error">
                  {memberError}
                </p>
              )}

              {members.length > 0 ? (
                <div className="members-list">
                  {members.map((member) => (
                    <div
                      className="member-card"
                      key={member._id}
                    >
                      <div>
                        <h3>{member.name}</h3>

                        <p>{member.email}</p>
                      </div>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleRemoveMember(member._id)
                        }
                        disabled={
                          removingMemberId === member._id
                        }
                      >
                        {removingMemberId === member._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="project-empty-state">
                  <h3>No team members yet</h3>

                  <p>
                    Add team members to collaborate on
                    this project.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="project-tab-content">
              <div className="project-section-header">
                <div>
                  <h2>Project Overview</h2>

                  <p>
                    Basic information about this project.
                  </p>
                </div>
              </div>

              <div className="overview-content">
                <p>
                  {project.description ||
                    "No description provided."}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTask
          projectId={project._id}
          onTaskCreated={handleTaskCreated}
          onCancel={() => setShowCreateTask(false)}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTask
          task={editingTask}
          onTaskUpdated={handleTaskUpdated}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <AddMember
          projectId={project._id}
          existingMembers={members}
          onMemberAdded={handleMemberAdded}
          onCancel={() => setShowAddMember(false)}
        />
      )}
    </div>
  );
}

export default ProjectDetails;