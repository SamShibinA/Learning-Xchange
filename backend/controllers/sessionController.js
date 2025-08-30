// const Session = require("../models/sessionModel");
// const User = require("../models/userModel");

// // ✅ Create a session
// const createSession = async (req, res) => {
//   try {
//     const { title, description, skill, scheduledFor, duration, maxLearners } = req.body;

//     if (!title || !description || !skill || !scheduledFor || !duration || !maxLearners) {
//       return res.status(400).json({ message: "Please fill all the fields" });
//     }

//     const session = new Session({
//       ...req.body,
//       tutorId: req.user.userId, // logged in tutor
//     });

//     await session.save();
//     res.status(201).json(session);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating session" });
//   }
// };

// // ✅ Get all sessions
// const getSessions = async (req, res) => {
//   try {
//     const sessions = await Session.find();
//     res.status(200).json(sessions)
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error getting sessions" });
//   }
// };

// // ✅ Enroll learner in a session
// const enrollInSession = async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;
//     const userId = req.user.userId;

//     const session = await Session.findById(sessionId);
//     if (!session) {
//       return res.status(404).json({ message: "Session not found" });
//     }

//     // check if already enrolled
//     if (session.enrolledLearners.includes(userId)) {
//       return res.status(400).json({ message: "Already enrolled in this session" });
//     }

//     // check max learners
//     if (session.enrolledLearners.length >= session.maxLearners) {
//       return res.status(400).json({ message: "Session is full" });
//     }

//     // push user into enrolled list
//     session.enrolledLearners.push(userId);
//     await session.save();

//     // update user's sessionsAttended
//     await User.findByIdAndUpdate(userId, { $inc: { sessionsAttended: 1 } });

//     res.json(session);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error enrolling in session" });
//   }
// };

// // ✅ Start live session (for tutor)
// const startLiveSession = async (req, res) => {
//   try {
//     const sessionId = req.params.sessionId;
//     const tutorId = req.user.userId;

//     const session = await Session.findById(sessionId);
//     if (!session) return res.status(404).json({ message: "Session not found" });

//     if (session.tutorId.toString() !== tutorId) {
//       return res.status(403).json({ message: "Not authorized to start this session" });
//     }

//     session.status = "live";
//     await session.save();

//     res.json(session);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error starting session" });
//   }
// };

// module.exports = { createSession, getSessions, enrollInSession, startLiveSession };


const Session = require("../models/sessionModel");
const User = require("../models/userModel");

// ✅ Create a session
const createSession = async (req, res) => {
  try {
    const { title, description, skill, scheduledFor, duration, maxLearners } = req.body;

    if (!title || !description || !skill || !scheduledFor || !duration || !maxLearners) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const session = new Session({
      ...req.body,
      tutorId: req.user.userId, // logged in tutor
    });

    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating session" });
  }
};

// ✅ Get all sessions
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    res.status(200).json(sessions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting sessions" });
  }
};

// ✅ Enroll learner in a session
const enrollInSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const userId = req.user.userId;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.enrolledLearners.includes(userId)) {
      return res.status(400).json({ message: "Already enrolled in this session" });
    }

    if (session.enrolledLearners.length >= session.maxLearners) {
      return res.status(400).json({ message: "Session is full" });
    }

    session.enrolledLearners.push(userId);
    await session.save();

    await User.findByIdAndUpdate(userId, { $inc: { sessionsAttended: 1 } });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error enrolling in session" });
  }
};

// ✅ Start live session
const startLiveSession = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const tutorId = req.user.userId;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.tutorId.toString() !== tutorId) {
      return res.status(403).json({ message: "Not authorized to start this session" });
    }

    session.status = "live";
    await session.save();

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error starting session" });
  }
};

// ✅ Get chat messages for a session
const getSessionMessages = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const session = await Session.findById(sessionId).populate("chatMessages.senderId", "name");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session.chatMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching chat messages" });
  }
};

module.exports = {
  createSession,
  getSessions,
  enrollInSession,
  startLiveSession,
  getSessionMessages,
};
