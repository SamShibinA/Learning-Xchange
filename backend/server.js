// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const http = require("http");
// const { WebSocketServer } = require("ws");

// const { connectDB } = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const sessionRoutes = require("./routes/sessionRoutes");

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("✅ API is running");
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/sessions", sessionRoutes);

// // Create HTTP + WebSocket server
// const server = http.createServer(app);
// const wss = new WebSocketServer({ server });

// /**
//  * Track connected clients
//  * rooms = { roomId: Set of clients }
//  */
// const rooms = new Map();

// wss.on("connection", (ws) => {
//   console.log("🔗 WebSocket client connected");

//   ws.on("message", (msg) => {
//     try {
//       const data = JSON.parse(msg);

//       switch (data.type) {
//         case "join": {
//           const { roomId, userId } = data;
//           ws.roomId = roomId;
//           ws.userId = userId;

//           if (!rooms.has(roomId)) {
//             rooms.set(roomId, new Set());
//           }
//           rooms.get(roomId).add(ws);

//           console.log(`👥 User ${userId} joined room ${roomId}`);

//           // Notify others
//           rooms.get(roomId).forEach((client) => {
//             if (client !== ws && client.readyState === ws.OPEN) {
//               client.send(
//                 JSON.stringify({ type: "user-joined", userId })
//               );
//             }
//           });
//           break;
//         }

//         case "offer":
//         case "answer":
//         case "candidate": {
//           const { target, ...rest } = data;
//           rooms.get(ws.roomId)?.forEach((client) => {
//             if (client.userId === target && client.readyState === ws.OPEN) {
//               client.send(JSON.stringify({ ...rest, from: ws.userId }));
//             }
//           });
//           break;
//         }

//         case "leave": {
//           handleLeave(ws);
//           break;
//         }
//       }
//     } catch (err) {
//       console.error("❌ Error handling message:", err);
//     }
//   });

//   ws.on("close", () => {
//     console.log("🔌 Client disconnected");
//     handleLeave(ws);
//   });
// });

// function handleLeave(ws) {
//   const { roomId, userId } = ws;
//   if (!roomId || !rooms.has(roomId)) return;

//   rooms.get(roomId).delete(ws);

//   // Notify others in the room
//   rooms.get(roomId).forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(JSON.stringify({ type: "user-left", userId }));
//     }
//   });

//   if (rooms.get(roomId).size === 0) {
//     rooms.delete(roomId);
//   }
// }

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`✅ Server + WS running on http://localhost:${PORT}`)
// );
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
 * Track connected clients by room
 * rooms = Map<roomId, Set<ws>>
 */
const rooms = new Map();

// Make ws + rooms available to controllers via req.app.get(...)
app.set("wss", wss);
app.set("rooms", rooms);

wss.on("connection", (ws) => {
  console.log("🔗 WebSocket client connected");

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      switch (data.type) {
        case "join": {
          // data: { type: 'join', roomId, userId }
          const { roomId, userId } = data;
          if (!roomId || !userId) return;

          ws.roomId = roomId;
          ws.userId = userId;

          if (!rooms.has(roomId)) rooms.set(roomId, new Set());
          rooms.get(roomId).add(ws);

          console.log(`👥 User ${userId} joined room ${roomId}`);

          // Notify others in the room
          rooms.get(roomId).forEach((client) => {
            if (client !== ws && client.readyState === ws.OPEN) {
              client.send(JSON.stringify({ type: "user-joined", userId }));
            }
          });
          break;
        }

        case "leave": {
          handleLeave(ws);
          break;
        }

        // WebRTC signaling passthrough
        case "offer":
        case "answer":
        case "candidate": {
          // data should include: { target, roomId, ... }
          const { target, roomId, ...rest } = data;
          if (!roomId || !target) return;
          rooms.get(roomId)?.forEach((client) => {
            if (client.userId === target && client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({ ...rest, type: data.type, from: ws.userId })
              );
            }
          });
          break;
        }

        // Optional: front-end may still send this to nudge clients.
        // DB update is handled by REST controller; here we only broadcast.
        case "start-session": {
          const { sessionId, actorId } = data;
          if (!sessionId) return;

          // Broadcast to the session room
          rooms.get(sessionId)?.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({
                  type: "session-started",
                  sessionId,
                  actorId: actorId || null,
                  timestamp: new Date().toISOString(),
                })
              );
            }
          });

          // And (safety) broadcast to all clients (for users not joined to room yet)
          wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
              client.send(
                JSON.stringify({
                  type: "session-started-global",
                  sessionId,
                  actorId: actorId || null,
                })
              );
            }
          });
          break;
        }

        default:
          // no-op
          break;
      }
    } catch (err) {
      console.error("❌ Error handling WS message:", err);
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

  if (rooms.get(roomId).size === 0) rooms.delete(roomId);
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`✅ Server + WS running on http://localhost:${PORT}`)
);


