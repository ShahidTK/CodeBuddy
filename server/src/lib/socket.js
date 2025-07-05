import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  },
});

// 👇 User socket mapping
const userSocketMap = {}; // { userId: socketId }

// Helper to get receiver socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // 🔐 Identify user from query param
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // 📢 Notify all clients about online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Code editor sync logic
  socket.on("codeChange", (newCode) => {
    socket.broadcast.emit("codeChange", newCode);
  });

  socket.on("languageChange", (language) => {
    socket.broadcast.emit("languageChange", language);
  });

  socket.on("inputChange", (input) => {
    socket.broadcast.emit("inputChange", input);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove user from map
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }

    // Update all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };