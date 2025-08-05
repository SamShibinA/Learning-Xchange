const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: { type: String, enum: ['learner', 'tutor'] },
  profileComplete: Boolean,
  skills: [String],
  bio: String,
  hourlyRate: Number,
  rating: Number,
  totalRatings: Number,
  canCharge: Boolean,
  interests: [String],
  sessionsAttended: Number,
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
