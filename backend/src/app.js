const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // 1000 request per 15 menit
  message: {
    success: false,
    message: "Terlalu banyak permintaan, coba lagi nanti",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 10 percobaan dalam 15 menit
  message: {
    success: false,
    message: "Terlalu banyak percobaan login/registrasi. Silakan tunggu 15 menit lagi.",
  },
});

app.use("/api", limiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);
app.use("/api/v1/auth/totp/validate", authLimiter);
app.use("/api/v1/email/forgot-password", authLimiter);
app.use("/api/v1/email/reset-password", authLimiter);



app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

const uploadsPath = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsPath));

app.use("/api/v1/uploads", express.static(uploadsPath));

app.use("/api/v1", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
