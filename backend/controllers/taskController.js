const Task = require("../models/Task");
const Project = require("../models/Project");

// Create Task
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      project,
      assignedTo,
      dueDate,
    } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Task title and project are required",
      });
    }

    // Check whether project exists
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only project owner can create tasks
    if (existingProject.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to create a task for this project",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user.userId,
      dueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("Create task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Tasks for a Project
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to view tasks for this project",
      });
    }

    const tasks = await Task.find({
      project: projectId,
    })
      .populate("project", "name status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Single Task
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("project", "name status owner")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to access this task",
      });
    }

    res.status(200).json({
      task,
    });
  } catch (error) {
    console.error("Get task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to update this task",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      dueDate,
    } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.assignedTo = assignedTo ?? task.assignedTo;
    task.dueDate = dueDate ?? task.dueDate;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("project", "name status")
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Update task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (task.project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
};