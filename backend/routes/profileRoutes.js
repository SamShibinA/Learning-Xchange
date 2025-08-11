const express = require('express');
const { updateProfile,getTutorById } = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, updateProfile);
router.get('/:tutorId',authenticateToken,getTutorById)

module.exports = router;
