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
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api", limiter);

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
