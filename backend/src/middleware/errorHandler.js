const logger = require("../utils/logger");
const { errorResponse } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  // Prisma unique constraint (duplicate key)
  if (err.code === "P2002") {
    const message = "Duplikat nilai pada field unik";
    error = { message, statusCode: 400 };
  }

  // prisma record not found
  if (err.code === "P2025") {
    const message = "Data tidak ditemukan";
    error = { message, statusCode: 404 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid Token";
    error = { message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token Expired";
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
