const express = require('express');
const { updateProfile,getTutorById,rateTutor} = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, updateProfile);

router.get('/:tutorId',authenticateToken,getTutorById)

router.post('/:tutorId/rate', authenticateToken, rateTutor);

module.exports = router;
