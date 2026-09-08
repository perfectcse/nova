const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All project routes require authentication
router.use(protect);

// Project CRUD
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// Project member management
router.post("/:id/members", addProjectMember);
router.delete("/:id/members/:userId", removeProjectMember);

module.exports = router;