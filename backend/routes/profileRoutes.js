const express = require("express");
const {
  updateProfile,
  getTutorById,
  rateTutor,
  getMyProfile,
} = require("../controllers/profileController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in user profile
router.get("/me", authenticateToken, getMyProfile);

// Update logged-in user profile
router.put("/", authenticateToken, updateProfile);

// Get tutor by ID
router.get("/:tutorId", authenticateToken, getTutorById);

// Rate tutor
router.post("/:tutorId/rate", authenticateToken, rateTutor);

module.exports = router;
