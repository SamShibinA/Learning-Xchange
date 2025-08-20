const express = require('express');
const { register, login, me,getTutor } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, me);
router.get('/users',authenticateToken,getTutor)

module.exports = router;
