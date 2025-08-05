const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      role,
      profileComplete: role === 'learner',
      sessionsAttended: role === 'learner' ? 0 : undefined,
      skills: role === 'tutor' ? [] : undefined,
      bio: role === 'tutor' ? '' : undefined,
      hourlyRate: role === 'tutor' ? 0 : undefined,
      rating: role === 'tutor' ? 0 : undefined,
      totalRatings: role === 'tutor' ? 0 : undefined,
      canCharge: false,
      interests: role === 'learner' ? [] : undefined,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
