const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");
const mongoose = require("mongoose");

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const Session = require("./models/sessionModel");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/sessions", sessionRoutes);

// Create HTTP + WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

/**
 * Track connected clients
 * rooms = { roomId: Set of clients }
 */
const rooms = new Map();

wss.on("connection", (ws) => {
  console.log("🔗 WebSocket client connected");

  ws.on("message", async (msg) => {
    try {
      const data = JSON.parse(msg);

      switch (data.type) {
        case "join": {
          const { roomId, userId } = data;
          ws.roomId = roomId;
          ws.userId = userId;

          if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
          }
          rooms.get(roomId).add(ws);

          console.log(`👥 User ${userId} joined room ${roomId}`);

          // ✅ Send chat history to this user
          const session = await Session.findById(roomId);
          if (session) {
            ws.send(
              JSON.stringify({
                type: "chat-history",
                messages: session.chatMessages,
              })
            );
          }

          // Notify others
          rooms.get(roomId).forEach((client) => {
            if (client !== ws && client.readyState === ws.OPEN) {
              client.send(JSON.stringify({ type: "user-joined", userId }));
            }
          });
          break;
        }

        case "chat-message": {
          const { roomId, userId, senderName, message } = data;

          // ✅ Save to DB
          const session = await Session.findById(roomId);
          if (session) {
            const newMessage = {
              senderId: new mongoose.Types.ObjectId(userId),
              senderName,
              message,
              timestamp: new Date(),
            };
            session.chatMessages.push(newMessage);
            await session.save();

            // Broadcast to all in room
            rooms.get(roomId)?.forEach((client) => {
              if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ type: "chat-message", ...newMessage }));
              }
            });
          }
          break;
        }

        case "offer":
        case "answer":
        case "candidate": {
          const { target, ...rest } = data;
          rooms.get(ws.roomId)?.forEach((client) => {
            if (client.userId === target && client.readyState === ws.OPEN) {
              client.send(JSON.stringify({ ...rest, from: ws.userId }));
            }
          });
          break;
        }

        case "leave": {
          handleLeave(ws);
          break;
        }
      }
    } catch (err) {
      console.error("❌ Error handling message:", err);
    }
  });

  ws.on("close", () => {
    console.log("🔌 Client disconnected");
    handleLeave(ws);
  });
});

function handleLeave(ws) {
  const { roomId, userId } = ws;
  if (!roomId || !rooms.has(roomId)) return;

  rooms.get(roomId).delete(ws);

  // Notify others in the room
  rooms.get(roomId).forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify({ type: "user-left", userId }));
    }
  });

  if (rooms.get(roomId).size === 0) {
    rooms.delete(roomId);
  }
}


setInterval(async () => {
  try {
    const now = new Date();

    // Fetch all sessions and filter manually
    const sessions = await Session.find({});
    let deletedCount = 0;

    for (const session of sessions) {
      const endTime = new Date(session.scheduledFor.getTime() + session.duration * 60000);
      const expiryTime = new Date(endTime.getTime() + 60 * 60000); // +1 hour

      if (expiryTime < now) {
        await Session.findByIdAndDelete(session._id);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      console.log(`🗑 Deleted ${deletedCount} expired sessions`);
    }
  } catch (err) {
    console.error("❌ Error deleting expired sessions:", err.message);
  }
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server + WS running on http://localhost:${PORT}`)
);
