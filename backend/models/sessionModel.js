const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tutorName: { type: String, required: true },
  skill: { type: String, required: true },
  scheduledFor: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  maxLearners: { type: Number, default: 10 },
  enrolledLearners: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  status: { type: String, enum: ['scheduled', 'live','completed', 'cancelled'], default: 'scheduled' },
  price: { type: Number, default: 0 },
  chatMessages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
