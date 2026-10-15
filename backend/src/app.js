const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");

const { corsOptions } = require("./config/cors");

const app = express();

// Trust reverse proxy (Cloudflare and Render) for accurate client IP resolution in rate limiters
app.set("trust proxy", 1);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors(corsOptions));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 1000, // 1000 request per 15 menit
  message: {
    success: false,
    message: "Terlalu banyak permintaan, coba lagi nanti",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 percobaan dalam 15 menit
  message: {
    success: false,
    message: "Terlalu banyak percobaan login/registrasi. Silakan tunggu 15 menit lagi.",
  },
  standardHeaders: true,
  legacyHeaders: false,
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
