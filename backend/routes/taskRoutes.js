const express = require("express");

const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All task routes require authentication
router.use(protect);

// Create a task
router.post("/", createTask);

// Get all tasks for a project
router.get("/project/:projectId", getTasksByProject);

// Get a single task
router.get("/:id", getTaskById);

// Update a task
router.put("/:id", updateTask);

// Delete a task
router.delete("/:id", deleteTask);

module.exports = router;