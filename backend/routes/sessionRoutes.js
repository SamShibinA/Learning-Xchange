
const express = require("express");
const {
  createSession,
  getSessions,
  enrollInSession,
  startLiveSession,
  getSessionMessages,
} = require("../controllers/sessionController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createSession);
router.get("/", authenticateToken, getSessions);
router.get("/:sessionId/messages", authenticateToken, getSessionMessages);
// ✅ New routes
router.post("/:sessionId/enroll", authenticateToken, enrollInSession);
router.patch("/:sessionId/start", authenticateToken, startLiveSession);

module.exports = router;
