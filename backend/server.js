require("dotenv").config();
const app = require("./src/app");
const { connectDB } = require("./src/config/database");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

const server = app.listen(PORT, () => {
  logger.info(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    process.exit(0);
  });
});
