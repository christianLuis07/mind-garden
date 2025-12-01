require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./src/app");
const { connectDB } = require("./src/config/database");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  logger.info(`User connected to socket: ${socket.id}`);

  socket.on("join_group", (groupId) => {
    socket.join(groupId);
    logger.info(`User ${socket.id} joined group: ${groupId}`);
  });

  socket.on("leave_group", (groupId) => {
    socket.leave(groupId);
    logger.info(`User ${socket.id} left group: ${groupId}`);
  });

  socket.on("disconnect", () => {});
});

server.listen(PORT, () => {
  logger.info(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

process.on("unhandledRejection", (err, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
