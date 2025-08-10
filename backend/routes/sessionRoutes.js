const express = require("express");
const { createSession,getSessions } = require("../controllers/sessionController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createSession);
router.get("/",authenticateToken,getSessions);
module.exports = router;
