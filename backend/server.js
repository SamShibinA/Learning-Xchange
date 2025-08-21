// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { connectDB } = require('./config/db');
// const authRoutes = require('./routes/authRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const sessionRoutes=require('./routes/sessionRoutes');
// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/sessions',sessionRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { WebSocketServer } = require("ws");

const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const sessionRoutes = require("./routes/sessionRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

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

  ws.on("message", (msg) => {
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

          // Notify others
          rooms.get(roomId).forEach((client) => {
            if (client !== ws && client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({ type: "user-joined", userId })
              );
            }
          });
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

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server + WS running on http://localhost:${PORT}`)
);


