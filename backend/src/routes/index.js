const express = require("express");
const authRoutes = require("./authRoutes");
const moodRoutes = require("./moodRoutes");
const journalRoutes = require("./journalRoutes");
const breathingRoutes = require("./breathingRoutes");
const supportRoutes = require("./supportRoutes");
const emailRoutes = require("./emailRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/email", emailRoutes);
router.use("/mood", moodRoutes);
router.use("/journal", journalRoutes);
router.use("/breathing", breathingRoutes);
router.use("/community", supportRoutes);
router.use("/admin", adminRoutes);

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
