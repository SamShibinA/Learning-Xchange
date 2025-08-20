const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['learner', 'tutor'], default: 'learner' },
  profileComplete: { type: Boolean, default: false },
  sessionsAttended: Number,
  skills: [String],
  bio: String,
  hourlyRate: Number,
  rating: Number,
  totalRatings: Number,
  canCharge: { type: Boolean, default: false },
  interests: [String],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
