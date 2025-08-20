// const express = require("express");
// const { createSession,getSessions } = require("../controllers/sessionController");
// const { authenticateToken } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/", authenticateToken, createSession);
// router.get("/",authenticateToken,getSessions);
// module.exports = router;
const express = require("express");
const {
  createSession,
  getSessions,
  enrollInSession,
  startLiveSession,
} = require("../controllers/sessionController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createSession);
router.get("/", authenticateToken, getSessions);

// ✅ New routes
router.post("/:sessionId/enroll", authenticateToken, enrollInSession);
router.patch("/:sessionId/start", authenticateToken, startLiveSession);

module.exports = router;
