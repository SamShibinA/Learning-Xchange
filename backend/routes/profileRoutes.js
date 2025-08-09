const express = require('express');
const { updateProfile } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, updateProfile);

module.exports = router;
