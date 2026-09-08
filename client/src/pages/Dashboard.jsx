import { useCallback, useEffect, useState } from "react";
import api from "../service/api";
import CreateProject from "./CreateProject";
import EditProject from "./EditProject";
import ProjectDetails from "./ProjectDetails";
import "../styles/dashboard.css";

function Dashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const [error, setError] = useState("");

  const [showCreateProject, setShowCreateProject] =
    useState(false);

  const [editingProject, setEditingProject] = useState(null);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [deletingProjectId, setDeletingProjectId] =
    useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAllTasks = useCallback(async (projectList) => {
    if (!projectList.length) {
      setTasks([]);
      return;
    }

    try {
      setLoadingTasks(true);

      const taskResponses = await Promise.all(
        projectList.map((project) =>
          api.get(`/tasks/project/${project._id}`)
        )
      );

      const allTasks = taskResponses.flatMap(
        (response) => response.data.tasks || []
      );

      setTasks(allTasks);
    } catch (error) {
      console.error(
        "Fetch dashboard tasks error:",
        error
      );

      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setError("");
      setLoadingProjects(true);

      const response = await api.get("/projects");

      const projectList =
        response.data.projects || [];

      setProjects(projectList);

      await fetchAllTasks(projectList);
    } catch (error) {
      console.error("Dashboard loading error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );

      setTasks([]);
    } finally {
      setLoadingProjects(false);
    }
  }, [fetchAllTasks]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDashboard();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadDashboard]);

  const handleLogout = () => {
    onLogout();
  };

  const handleProjectCreated = async () => {
    setShowCreateProject(false);

    await loadDashboard();
  };

  const handleProjectUpdated = async (
    updatedProject
  ) => {
    setEditingProject(null);

    const updatedProjects = projects.map((project) =>
      project._id === updatedProject._id
        ? updatedProject
        : project
    );

    setProjects(updatedProjects);

    await fetchAllTasks(updatedProjects);
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project? All project data may become inaccessible."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingProjectId(projectId);
      setError("");

      await api.delete(`/projects/${projectId}`);

      const updatedProjects = projects.filter(
        (project) => project._id !== projectId
      );

      setProjects(updatedProjects);

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.project?._id !== projectId
        )
      );
    } catch (error) {
      console.error(
        "Delete project error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete project."
      );
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleBackFromProject = async () => {
    setSelectedProject(null);

    await loadDashboard();
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const totalTeamMembers = [
    ...new Set(
      projects.flatMap((project) =>
        (project.members || []).map(
          (member) => member._id
        )
      )
    ),
  ].length;

  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={handleBackFromProject}
      />
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>NOVA</h1>

          <p>Plan. Collaborate. Deliver.</p>
        </div>

        <div className="dashboard-user">
          <span>
            Welcome, {user?.name || "User"}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-welcome">
          <h2>Dashboard</h2>

          <p>
            Manage your projects, tasks, team members, and
            progress from one place.
          </p>
        </section>

        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>Projects</h3>

            <p>
              {loadingProjects
                ? "..."
                : projects.length}
            </p>
          </div>

          <div className="stat-card">
            <h3>Tasks</h3>

            <p>
              {loadingTasks ? "..." : totalTasks}
            </p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>

            <p>
              {loadingTasks
                ? "..."
                : completedTasks}
            </p>
          </div>

          <div className="stat-card">
            <h3>Team Members</h3>

            <p>{totalTeamMembers}</p>
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <div>
              <h2>Projects</h2>

              <p>
                Your projects from the NOVA backend.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setShowCreateProject(true)
              }
            >
              + New Project
            </button>
          </div>

          {error && (
            <div
              className="empty-state"
              style={{
                marginBottom: "20px",
                borderColor: "#fecaca",
              }}
            >
              <h3>Something went wrong</h3>

              <p>{error}</p>
            </div>
          )}

          {loadingProjects ? (
            <div className="empty-state">
              <h3>Loading projects...</h3>

              <p>
                Please wait while your projects are
                loaded.
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <h3>No projects yet</h3>

              <p>
                Create your first project to start
                managing tasks and collaborating with
                your team.
              </p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map((project) => {
                const projectTasks = tasks.filter(
                  (task) =>
                    task.project?._id === project._id
                );

                const completedProjectTasks =
                  projectTasks.filter(
                    (task) =>
                      task.status === "Completed"
                  ).length;

                const projectProgress =
                  projectTasks.length === 0
                    ? 0
                    : Math.round(
                        (completedProjectTasks /
                          projectTasks.length) *
                          100
                      );

                const isDeleting =
                  deletingProjectId === project._id;

                return (
                  <div
                    className="project-card-wrapper"
                    key={project._id}
                  >
                    <button
                      className="project-card"
                      onClick={() =>
                        setSelectedProject(project)
                      }
                      disabled={isDeleting}
                    >
                      <div className="project-card-header">
                        <h3>{project.name}</h3>

                        <span className="project-status">
                          {project.status}
                        </span>
                      </div>

                      <p>
                        {project.description ||
                          "No description provided."}
                      </p>

                      <div className="project-progress">
                        <div className="project-progress-header">
                          <span>Progress</span>

                          <strong>
                            {projectProgress}%
                          </strong>
                        </div>

                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{
                              width: `${projectProgress}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="project-card-meta">
                        <span>
                          Tasks: {completedProjectTasks}/
                          {projectTasks.length}
                        </span>

                        <span>
                          Members:{" "}
                          {project.members?.length || 0}
                        </span>
                      </div>
                    </button>

                    <div className="project-card-actions">
                      <button
                        className="secondary-button"
                        onClick={() =>
                          setEditingProject(project)
                        }
                        disabled={isDeleting}
                      >
                        Edit Project
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteProject(
                            project._id
                          )
                        }
                        disabled={isDeleting}
                      >
                        {isDeleting
                          ? "Deleting..."
                          : "Delete Project"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {showCreateProject && (
        <CreateProject
          onProjectCreated={handleProjectCreated}
          onCancel={() =>
            setShowCreateProject(false)
          }
        />
      )}

      {editingProject && (
        <EditProject
          project={editingProject}
          onProjectUpdated={handleProjectUpdated}
          onCancel={() => setEditingProject(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;