const express = require("express");
const {
  createBreathingSession,
  getBreathingSessions,
  getBreathingAnalytics,
  getBreathingTechniques,
} = require("../controllers/breathingController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.use(auth); // All routes require auth

router.post("/sessions", createBreathingSession);
router.get("/sessions", getBreathingSessions);
router.get("/analytics", getBreathingAnalytics);
router.get("/techniques", getBreathingTechniques);

module.exports = router;
