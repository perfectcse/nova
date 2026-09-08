const express = require("express");

const {
  registerUser,
  loginUser,
  getUsers,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Public authentication routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected users route
router.get("/users", protect, getUsers);

module.exports = router;