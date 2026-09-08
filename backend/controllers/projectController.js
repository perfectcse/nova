const Project = require("../models/Project");
const User = require("../models/User");

// Create Project
const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      status,
      members,
      startDate,
      dueDate,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      owner: req.user.userId,
      members: members || [],
      startDate,
      dueDate,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create project error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get All Projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user.userId,
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get Single Project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only owner can access the project for now
    if (project.owner._id.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to access this project",
      });
    }

    res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Update Project
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to update this project",
      });
    }

    const {
      name,
      description,
      status,
      members,
      startDate,
      dueDate,
    } = req.body;

    project.name = name ?? project.name;
    project.description = description ?? project.description;
    project.status = status ?? project.status;
    project.members = members ?? project.members;
    project.startDate = startDate ?? project.startDate;
    project.dueDate = dueDate ?? project.dueDate;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update project error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to delete this project",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Add Project Member
const addProjectMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only project owner can add members
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to add members",
      });
    }

    // Check whether user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Owner cannot be added as a member
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        message: "Project owner is already a member",
      });
    }

    // Check duplicate member
    if (project.members.some((member) => member.toString() === userId)) {
      return res.status(400).json({
        message: "User is already a project member",
      });
    }

    project.members.push(userId);

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Add member error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Remove Project Member
const removeProjectMember = async (req, res) => {
  try {
    const { userId } = req.params;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Only project owner can remove members
    if (project.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "Not authorized to remove members",
      });
    }

    // Check whether member exists in project
    const isMember = project.members.some(
      (member) => member.toString() === userId
    );

    if (!isMember) {
      return res.status(404).json({
        message: "User is not a member of this project",
      });
    }

    project.members = project.members.filter(
      (member) => member.toString() !== userId
    );

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Member removed successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Remove member error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};