require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const app = require("./src/app");
const { connectDB, prisma } = require("./src/config/database");
const logger = require("./src/utils/logger");

const { isOriginAllowed } = require("./src/config/cors");

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io JWT Authentication Middleware
io.use(async (socket, next) => {
  try {
    let token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    if (!token && socket.handshake.query?.token) {
      token = socket.handshake.query.token;
    }

    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return next(new Error("Authentication error: Invalid token"));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || user.isActive === false) {
      return next(new Error("Authentication error: User inactive or not found"));
    }

    socket.user = user;
    next();
  } catch (err) {
    logger.warn(`Socket authentication failed: ${err.message}`);
    return next(new Error("Authentication error: Invalid or expired token"));
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  logger.info(`User connected to socket: ${socket.id} (user: ${socket.user?.id})`);

  socket.on("join_group", async (groupId) => {
    try {
      if (!groupId || typeof groupId !== "string") return;

      const group = await prisma.supportGroup.findUnique({
        where: { id: groupId },
        select: { id: true, isPublic: true },
      });

      if (!group) {
        socket.emit("error", { message: "Group not found" });
        return;
      }

      // If private group, verify membership
      if (!group.isPublic) {
        const isMember = await prisma.supportGroupMember.findUnique({
          where: {
            userId_supportGroupId: {
              userId: socket.user.id,
              supportGroupId: groupId,
            },
          },
        });

        if (!isMember) {
          socket.emit("error", { message: "Unauthorized to join private group" });
          return;
        }
      }

      socket.join(groupId);
      logger.info(`User ${socket.user.id} joined group: ${groupId}`);
    } catch (err) {
      logger.error("Error joining group socket:", err.message);
    }
  });

  socket.on("leave_group", (groupId) => {
    if (groupId) {
      socket.leave(groupId);
      logger.info(`User ${socket.user?.id || socket.id} left group: ${groupId}`);
    }
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
